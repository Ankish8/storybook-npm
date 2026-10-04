/**
 * Pressed-state capture: holds the mouse button DOWN on an element (capture.mjs can only click) and records a screenshot plus
 * computed styles, in the same <name>.<label>.png/.json format so figma-report.mjs picks them up.
 *
 *   node design/figma-reports/press-capture.mjs <config.json> --label before|after --out <dir> [--url http://localhost:6008]
 *
 * config.json: [{ name, story, press: "<css>", hold?: ms (default 400), width?, height?, probe?: "<js evaluated just before the release>", probeAfter?: "<js evaluated right after the release and again 300ms later>", measure?: { label: { sel, props } } }]
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d);
const configs = JSON.parse(fs.readFileSync(path.resolve(argv[0]), "utf8"));
const out = path.resolve(opt("out", "."));
const label = opt("label", "before");
const base = opt("url", "http://localhost:6008");

const chromePath = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].find(fs.existsSync);
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "sb-press-"));
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "--mute-audio", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const cleanup = () => { try { chrome.kill("SIGKILL"); } catch { /* gone */ } try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } };
process.on("exit", cleanup);

let target;
for (let i = 0; i < 80 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch { /* starting */ } if (!target) await sleep(250); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const { res, rej } = pending.get(d.id); pending.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); } };
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => { const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
await send("Page.enable"); await send("Runtime.enable");

for (const sc of configs) {
  await send("Emulation.setDeviceMetricsOverride", { width: sc.width || 1000, height: sc.height || 800, deviceScaleFactor: 2, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Page.navigate", { url: `${base}/iframe.html?id=${sc.story}&viewMode=story` });
  for (let i = 0; i < 80; i++) { await sleep(250); if (await ev("!!document.querySelector('#storybook-root') && document.querySelector('#storybook-root').children.length>0 && document.readyState==='complete'").catch(() => false)) break; }
  await sleep(600);
  let error;
  try {
    const c = await ev(`(() => { const e = document.querySelector(${JSON.stringify(sc.press)}); if (!e) return null; e.scrollIntoView({ block: "nearest" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    if (!c) throw new Error(`no element for ${sc.press}`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: c.x, y: c.y, button: "none" });
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: c.x, y: c.y, button: "left", buttons: 1, clickCount: 1 });
    await sleep(sc.hold ?? 400);
    const evals = [];
    const measured = {};
    for (const [k, m] of Object.entries(sc.measure || {})) measured[k] = await ev(`(() => { const sel = ${JSON.stringify(m.sel)}, i = sel.indexOf("::"); const e = document.querySelector(i < 0 ? sel : sel.slice(0, i)); if (!e) return null; const s = i < 0 ? getComputedStyle(e) : getComputedStyle(e, sel.slice(i)), r = e.getBoundingClientRect(); const o = i < 0 ? { width: +r.width.toFixed(2), height: +r.height.toFixed(2) } : {}; for (const p of ${JSON.stringify(m.props || [])}) o[p] = s.getPropertyValue(p); return o; })()`);
    // Crop: the closest label/form/radiogroup (as before); when that has no size, grow from the pressed element to the first ancestor
    // that is clearly larger than it, so a bare 16px control still gets some context around it.
    const box = await ev(`(() => { const p = document.querySelector(${JSON.stringify(sc.press)}); const pr = p.getBoundingClientRect(); let e = p.closest("label, form, [role=radiogroup]"); if (!e || e.getBoundingClientRect().width === 0) { e = p; while (e.parentElement && e.id !== "storybook-root") { const r = e.getBoundingClientRect(); if (r.width >= pr.width + 120 && r.height >= pr.height + 20) break; e = e.parentElement; } } const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; })()`);
    const pad = 28;
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: box.height + pad * 2, scale: 1 } });
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, `${sc.name}.${label}.png`), Buffer.from(shot.data, "base64"));
    if (sc.probe) evals.push(await ev(sc.probe)); // just before the release
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: c.x, y: c.y, button: "left", buttons: 0, clickCount: 1 });
    if (sc.probeAfter) { evals.push(await ev(sc.probeAfter)); await sleep(300); evals.push(await ev(sc.probeAfter)); } // right after, and 300ms after
    fs.writeFileSync(path.join(out, `${sc.name}.${label}.json`), JSON.stringify({ story: sc.story, measured, popupBox: box, evals, error }, null, 2));
  } catch (e) { error = String(e.message || e); fs.writeFileSync(path.join(out, `${sc.name}.${label}.json`), JSON.stringify({ story: sc.story, measured: {}, error }, null, 2)); }
  console.log(`${error ? "FAIL" : "ok  "} ${sc.name}${error ? "  " + error : ""}`);
}
ws.close(); cleanup();
