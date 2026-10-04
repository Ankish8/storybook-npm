/**
 * Screenshot + computed-style capture of Storybook stories, for before/after Figma change reports.
 *
 *   node design/verify/capture.mjs <scenarios.mjs> --label before|after [--out dir] [--url http://localhost:6008] [--only name]
 *
 * A scenario file default-exports an array of
 *   { name, story, theme?: "light"|"dark", width?, height?, steps?: [...], measure?: { label: { sel, props } }, clip?: "root" | "popup" | "all" }
 * steps: { click: sel } | { hover: sel } | { type: "text" } | { key: "Escape" } | { wait: ms } | { eval: "js" } | { focus: sel }
 * Output: <out>/<name>.<label>.png (2x) and <out>/<name>.<label>.json (computed values for every `measure` entry).
 * Uses real mouse/keyboard events through the DevTools protocol, headless Chrome, reduced motion off.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d);

async function connect(port) {
  let target;
  for (let i = 0; i < 80 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch { /* starting */ }
    if (!target) await sleep(250);
  }
  if (!target) throw new Error("Chrome did not start");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const { res, rej } = pending.get(d.id); pending.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); } };
  return { send: (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }), close: () => ws.close() };
}

const PAGE = `
window.__c = (sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: "nearest" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
window.__ct = (text, scope) => { const rootEl = scope ? document.querySelector(scope) : document.body; if (!rootEl) return null; const cands = [...rootEl.querySelectorAll('button,[role=button],[role=combobox],[role=option],[role=tab],[role=menuitem],li,label,span')]; const e = cands.find((c) => c.textContent.trim() === text) || cands.find((c) => c.textContent.trim().includes(text)); if (!e) return null; e.scrollIntoView({ block: "nearest" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
window.__measure = (sel, props) => { const e = document.querySelector(sel); if (!e) return null; const s = getComputedStyle(e), r = e.getBoundingClientRect(); const o = { width: +r.width.toFixed(2), height: +r.height.toFixed(2) }; for (const p of props) o[p] = s.getPropertyValue(p); return o; };
window.__union = (mode) => {
  const els = [];
  const root = document.querySelector("#storybook-root");
  const vw = window.innerWidth;
  if (mode !== "popup" && root) root.querySelectorAll("*").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width > 4 && r.height > 4 && r.width < vw * 0.95) els.push(e); });
  document.querySelectorAll('[data-radix-popper-content-wrapper], [role="dialog"], [role="listbox"], [role="menu"], [role="tooltip"]').forEach((e) => els.push(e));
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const e of els) { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue; x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); }
  return x1 < 0 ? null : { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
};
`;

export async function capture(scenarios, { base = "http://localhost:6008", out, label = "before", only = [] } = {}) {
  fs.mkdirSync(out, { recursive: true });
  const chromePath = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].find(fs.existsSync);
  const port = 9300 + Math.floor(Math.random() * 500);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "sb-cap-"));
  const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "--mute-audio", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
  const cleanup = () => { try { chrome.kill("SIGKILL"); } catch { /* gone */ } try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } };
  process.on("exit", cleanup);
  const cdp = await connect(port);
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  const ev = async (expression) => { const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  const results = [];
  for (const sc of scenarios) {
    if (only.length && !only.some((o) => sc.name.includes(o))) continue;
    const w = sc.width || 1000, h = sc.height || 800;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 2, mobile: false });
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: sc.theme || "light" }, { name: "prefers-reduced-motion", value: "no-preference" }] });
    await cdp.send("Page.navigate", { url: `${base}/iframe.html?id=${sc.story}&viewMode=story` });
    for (let i = 0; i < 80; i++) { await sleep(250); if (await ev("!!document.querySelector('#storybook-root') && document.querySelector('#storybook-root').children.length>0 && document.readyState==='complete'").catch(() => false)) break; }
    await ev(PAGE); await sleep(500);
    const mouse = async (sel, type) => { const c = typeof sel === "object" ? await ev(`window.__ct(${JSON.stringify(sel.text)}, ${JSON.stringify(sel.within || "")})`) : await ev(`window.__c(${JSON.stringify(sel)})`); if (!c) throw new Error(`${sc.name}: no element for ${JSON.stringify(sel)}`); await cdp.send("Input.dispatchMouseEvent", { type: { move: "mouseMoved", down: "mousePressed", up: "mouseReleased" }[type], x: c.x, y: c.y, button: type === "move" ? "none" : "left", buttons: type === "down" ? 1 : 0, clickCount: type === "move" ? 0 : 1 }); };
    const keys = { Escape: 27, Tab: 9, Enter: 13, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Home: 36, End: 35, Backspace: 8 };
    let error;
    const evals = [];
    try {
      for (const st of sc.steps || []) {
        const tgt = st.click ?? (st.clickText && { text: st.clickText, within: st.within });
        const hov = st.hover ?? (st.hoverText && { text: st.hoverText, within: st.within });
        if (tgt) { await mouse(tgt, "move"); await mouse(tgt, "down"); await sleep(40); await mouse(tgt, "up"); await sleep(st.after ?? 350); }
        else if (hov) { await mouse(hov, "move"); await sleep(st.after ?? 350); }
        else if (st.focus) { await ev(`document.querySelector(${JSON.stringify(st.focus)}).focus()`); await sleep(250); }
        else if (st.type) { for (const ch of st.type) { await cdp.send("Input.dispatchKeyEvent", { type: "char", text: ch }); await sleep(20); } await sleep(250); }
        else if (st.key) { for (let n = 0; n < (st.repeat || 1); n++) { await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: st.key, code: st.key, windowsVirtualKeyCode: keys[st.key] || 0 }); await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: st.key, code: st.key, windowsVirtualKeyCode: keys[st.key] || 0 }); await sleep(60); } await sleep(300); }
        else if (st.wait) await sleep(st.wait);
        else if (st.eval) { evals.push(await ev(st.eval)); await sleep(st.after ?? 250); }
      }
      await sleep(sc.settle ?? 500);
    } catch (e) { error = String(e.message || e); }
    const box = await ev(`window.__union(${JSON.stringify(sc.clip || "all")})`);
    const pad = 20;
    const clip = box ? { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: Math.min(w, box.width + pad * 2), height: Math.min(h, box.height + pad * 2), scale: 1 } : undefined;
    const shot = await cdp.send("Page.captureScreenshot", { format: "png", ...(clip ? { clip } : {}) });
    fs.writeFileSync(path.join(out, `${sc.name}.${label}.png`), Buffer.from(shot.data, "base64"));
    const measured = {};
    for (const [k, m] of Object.entries(sc.measure || {})) measured[k] = await ev(`window.__measure(${JSON.stringify(m.sel)}, ${JSON.stringify(m.props || [])})`);
    fs.writeFileSync(path.join(out, `${sc.name}.${label}.json`), JSON.stringify({ story: sc.story, measured, popupBox: box, evals, error }, null, 2));
    results.push({ name: sc.name, ok: !error, error });
    console.log(`${error ? "FAIL" : "ok  "} ${sc.name}${error ? "  " + error : ""}`);
  }
  cdp.close(); cleanup();
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const file = argv[0];
  const scenarios = (await import(pathToFileURL(path.resolve(file)).href)).default;
  const results = await capture(scenarios, { base: opt("url", "http://localhost:6008"), out: path.resolve(opt("out", "design/figma-reports/_captures")), label: opt("label", "before"), only: (opt("only", "") || "").split(",").filter(Boolean) });
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}
