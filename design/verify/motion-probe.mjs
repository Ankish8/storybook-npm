#!/usr/bin/env node
/**
 * Motion probe: proves the v2 micro-interactions actually run in a real browser, and that they switch off under
 * `prefers-reduced-motion: reduce`.
 *
 * For every scenario it opens a story in headless Chrome, performs REAL input (CDP mouse events, so :hover / :active
 * apply), records every CSS animation and transition that starts (document.getAnimations, sampled every frame) and
 * checks them against the scenario's expectations twice: with normal motion and with reduced motion emulated.
 *
 *   node design/verify/motion-probe.mjs                        # against http://localhost:6008
 *   node design/verify/motion-probe.mjs --url http://x --only dialog,switch
 *   node design/verify/motion-probe.mjs --static storybook-static
 *   node design/verify/motion-probe.mjs --out motion-report.json
 *
 * Exit code 1 when any expectation fails.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const argv = typeof process === "undefined" ? [] : process.argv.slice(2);
const opt = (k) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : undefined);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function serveStatic(dir) {
  const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff" };
  const abs = path.resolve(dir);
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(abs, p);
    if (!f.startsWith(abs) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` })));
}

async function connect(port) {
  let target;
  for (let i = 0; i < 80 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch { /* starting */ }
    if (!target) await sleep(250);
  }
  if (!target) throw new Error("Chrome did not start");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { const { res, rej } = pending.get(d.id); pending.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); }
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  return { send, close: () => ws.close() };
}

// ---------------------------------------------------------------------------------------------------------------
// Page-side recorder: every frame, remember each animation/transition that exists, with what it targets and how long
// it is. getAnimations() only shows RUNNING ones, so a 150ms animation must be caught while it is alive.
// ---------------------------------------------------------------------------------------------------------------
export const PAGE_HELPERS = `
(() => {
  const root = () => document.querySelector('#storybook-root') || document.body;
  window.__rec = null;
  window.__start = () => {
    const seen = new Map();
    const rects = [];
    let on = true;
    const tick = () => {
      if (!on) return;
      for (const a of document.getAnimations()) {
        const t = a.effect && a.effect.target;
        if (!t) continue;
        const kind = a.constructor.name;
        const name = kind === 'CSSTransition' ? a.transitionProperty : a.animationName;
        const dur = a.effect.getTiming().duration;
        const where = (t.getAttribute && (t.getAttribute('role') || t.getAttribute('data-slot') || '')) + '|' + t.tagName.toLowerCase();
        const key = kind + ':' + name + ':' + where + ':' + dur;
        if (!seen.has(key)) seen.set(key, { kind, name, dur, tag: t.tagName.toLowerCase(), role: t.getAttribute('role') || '', cls: (t.className && t.className.baseVal === undefined ? String(t.className) : '').slice(0, 90), origin: getComputedStyle(t).transformOrigin, w: t.offsetWidth, h: t.offsetHeight });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.__rec = { stop: () => { on = false; return { anims: [...seen.values()] }; } };
  };
  window.__stop = () => window.__rec.stop();
  window.__center = (sel) => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), w: r.width, h: r.height, l: r.left, t: r.top };
  };
  window.__style = (sel, prop) => { const el = document.querySelector(sel); return el ? getComputedStyle(el)[prop] : null; };
})();
`;

/** A computed transform as a scale factor: `none` and the identity matrix are both 1. */
const scaleOf = (t) => {
  if (!t || t === "none") return 1;
  const m = /^matrix\(([-\d.e]+),/.exec(t);
  return m ? Math.round(Number(m[1]) * 1000) / 1000 : NaN;
};

/** transform-origin resolves to px; "not centred" means it follows the trigger rather than the middle of the box. */
const offCentre = (a) => {
  const [x, y] = String(a.origin).split(" ").map(parseFloat);
  return Math.abs(x - a.w / 2) > 2 || Math.abs(y - a.h / 2) > 2;
};
/** Positioned panels must never animate where they sit (that is the "flies in from the corner" bug). */
const sitsStill = (r) => !r.anims.some((a) => a.kind === "CSSTransition" && ["left", "top", "right", "bottom", "visibility", "width", "height", "all"].includes(a.name) && a.role);

export const SCENARIOS = [
  // ---- press / hover feedback --------------------------------------------------------------------------------
  {
    name: "button-press", story: "v2-components-button--default",
    async run(p) {
      const sel = "#storybook-root button:not([disabled])";
      await p.mouse(sel, "move"); await sleep(260);
      await p.mouse(sel, "down"); await sleep(450);
      const pressed = await p.style(sel, "transform");
      await p.mouse(sel, "up"); await sleep(260);
      return { pressed, released: await p.style(sel, "transform") };
    },
    normal: (r) => scaleOf(r.pressed) === 0.97 && scaleOf(r.released) === 1,
    reduced: (r) => scaleOf(r.pressed) === 1,
  },
  {
    name: "icon-button-press", story: "v2-components-button--icon-only",
    async run(p) {
      const sel = "#storybook-root button:not([disabled])";
      await p.mouse(sel, "move"); await sleep(200);
      await p.mouse(sel, "down"); await sleep(450);
      const pressed = await p.style(sel, "transform");
      await p.mouse(sel, "up");
      return { pressed };
    },
    normal: (r) => scaleOf(r.pressed) === 0.96,
    reduced: (r) => scaleOf(r.pressed) === 1,
  },
  {
    name: "link-button-no-press", story: "v2-components-button--link",
    async run(p) {
      const sel = "#storybook-root button:not([disabled])";
      await p.mouse(sel, "move"); await sleep(200);
      await p.mouse(sel, "down"); await sleep(450);
      const pressed = await p.style(sel, "transform");
      await p.mouse(sel, "up");
      return { pressed };
    },
    normal: (r) => scaleOf(r.pressed) === 1,
    reduced: (r) => scaleOf(r.pressed) === 1,
  },
  {
    name: "button-save-flow", story: "v2-components-button--save-flow",
    async run(p) {
      const sel = "#storybook-root button:not([disabled])";
      await p.evalv("window.__buttonFlow = []; document.querySelector('#storybook-root button').focus(); let start = performance.now(); const sample = () => { const b = document.querySelector('#storybook-root button'); window.__buttonFlow.push({ t: performance.now() - start, width: b.offsetWidth, busy: b.getAttribute('aria-busy') === 'true', focused: document.activeElement === b, disabled: b.disabled, opacity: getComputedStyle(b.querySelector('[data-v2-button-label]')).opacity }); if (performance.now() - start < 1800) requestAnimationFrame(sample); }; requestAnimationFrame(sample);");
      await p.click(sel);
      await sleep(1800);
      return await p.evalv("({ frames: window.__buttonFlow, saved: document.querySelector('#storybook-root button').textContent.includes('Saved') })");
    },
    normal: (r) => r.saved && r.frames.some((f) => f.busy && f.focused && !f.disabled) && r.frames.some((f) => f.opacity > 0 && f.opacity < 1) && new Set(r.frames.map((f) => f.width)).size > 5,
    reduced: (r) => r.saved && r.frames.some((f) => f.busy && f.focused && !f.disabled) && new Set(r.frames.map((f) => f.width)).size <= 3,
  },
  {
    name: "button-popup-anchor", story: "v2-components-dropdownmenu--default",
    async run(p) {
      const sel = "#storybook-root button[aria-haspopup=menu]";
      await p.mouse(sel, "move"); await sleep(200);
      await p.mouse(sel, "down"); await sleep(250);
      const pressed = await p.style(sel, "transform");
      await p.mouse(sel, "up");
      return { pressed };
    },
    normal: (r) => scaleOf(r.pressed) === 1,
    reduced: (r) => scaleOf(r.pressed) === 1,
  },
  {
    name: "number-step-press", story: "v2-components-numberstepfield--minutes",
    async run(p) {
      const sel = "#storybook-root button[aria-label^='Increase']:not([disabled])";
      await p.mouse(sel, "move"); await sleep(200);
      await p.mouse(sel, "down"); await sleep(450);
      const pressed = await p.style(sel, "transform");
      await p.mouse(sel, "up");
      return { pressed };
    },
    normal: (r) => scaleOf(r.pressed) === 0.96,
    reduced: (r) => scaleOf(r.pressed) === 1,
  },
  // ---- toggles -----------------------------------------------------------------------------------------------
  {
    name: "switch-toggle", story: "v2-components-switch--off", observe: 700,
    async run(p) { await p.click("#storybook-root [role=switch]"); },
    normal: (r) => r.anims.some((a) => a.kind === "CSSTransition" && a.name === "transform" && a.dur === 240) && r.anims.some((a) => a.name === "background-color" && a.dur === 240),
    reduced: (r) => !r.anims.some((a) => a.name === "transform"),
  },
  {
    name: "checkbox-tick-pops", story: "v2-components-checkbox--unchecked", observe: 600,
    async run(p) { await p.click("#storybook-root [role=checkbox]"); },
    // 2026-10-04 refresh: the tick draws in (stroke-dashoffset 150ms) and the box pops (enter 200ms). Reduced motion keeps only a fade.
    normal: (r) => r.anims.some((a) => a.kind === "CSSTransition" && a.name === "stroke-dashoffset" && a.dur === 150) && r.anims.some((a) => a.kind === "CSSAnimation" && a.name === "enter" && a.dur === 200),
    reduced: (r) => !r.anims.some((a) => a.name === "enter" || a.name === "exit" || a.name === "stroke-dashoffset"),
  },
  {
    name: "radio-dot-grows", story: "v2-components-radio--all-variants", observe: 600,
    async run(p) { await p.click("#storybook-root input[type=radio]:not(:checked):not(:disabled)"); },
    normal: (r) => r.anims.some((a) => a.kind === "CSSTransition" && a.name === "background-size"),
    reduced: (r) => !r.anims.some((a) => a.name === "background-size"),
  },
  // ---- overlays ----------------------------------------------------------------------------------------------
  {
    name: "dialog-open-close", story: "v2-components-dialog--default", observe: 1100,
    async run(p) {
      await p.click("#storybook-root button");
      await sleep(450);
      await p.key("Escape");
    },
    normal: (r) => r.anims.some((a) => a.name === "enter" && a.dur === 220 && a.role === "dialog") && r.anims.some((a) => a.name === "exit" && a.dur === 160 && a.role === "dialog"),
    reduced: (r) => !r.anims.some((a) => a.name === "enter" || a.name === "exit"),
  },
  {
    name: "dropdown-menu", story: "v2-components-dropdown-menu--default", observe: 900,
    async run(p) { await p.click("#storybook-root button"); await sleep(400); await p.key("Escape"); },
    normal: (r) => r.anims.some((a) => a.name === "enter" && a.role === "menu" && offCentre(a)) && r.anims.some((a) => a.name === "exit" && a.role === "menu" && a.dur === 120),
    reduced: (r) => !r.anims.some((a) => a.name === "enter" || a.name === "exit"),
  },
  {
    name: "select-popper", story: "v2-components-select--default", observe: 700,
    async run(p) { await p.click("#storybook-root [role=combobox]"); },
    normal: (r) => r.anims.some((a) => a.name === "enter" && a.role === "listbox" && offCentre(a)),
    reduced: (r) => !r.anims.some((a) => a.name === "enter"),
  },
  {
    name: "tooltip", story: "v2-components-tooltip--default", observe: 2200,
    async run(p) { await p.mouse("#storybook-root button", "move"); await sleep(1500); },
    normal: (r) => r.anims.some((a) => a.name === "enter" && offCentre(a)),
    reduced: (r) => !r.anims.some((a) => a.name === "enter"),
  },
  // ---- content -----------------------------------------------------------------------------------------------
  {
    name: "tabs-panel-fade", story: "v2-components-tabs--horizontal", observe: 700,
    async run(p) { await p.click("#storybook-root [role=tab][aria-selected=false]:not([disabled])"); },
    normal: (r) => r.anims.some((a) => a.name === "enter" && a.role === "tabpanel" && a.dur === 150),
    reduced: (r) => !r.anims.some((a) => a.name === "enter"),
  },
  {
    name: "accordion-expand", story: "v2-components-accordion--default", observe: 700,
    async run(p) { await p.click("#storybook-root button[aria-expanded=false]"); },
    normal: (r) => r.anims.some((a) => a.name === "height" && a.dur === 240) && r.anims.some((a) => a.name === "transform" && a.dur === 240),
    reduced: (r) => !r.anims.some((a) => a.name === "transform" || a.name === "height"),
  },
  // ---- custom floating panels: must animate AND must not jump -------------------------------------------------
  ...[
    ["multi-select-panel", "v2-components-multiselect--default", "#storybook-root [role=combobox], #storybook-root button[aria-haspopup=listbox]", "[role=listbox]"],
    ["search-filter-panel", "v2-components-searchfilter--overview", "#storybook-root input", "body > div[style*='position: fixed']"],
    ["date-range-panel", "v2-components-daterangepicker--empty", "#storybook-root button[aria-haspopup]", "[role=dialog]"],
    ["date-time-panel", "v2-components-datetimepicker--empty", "#storybook-root button[aria-haspopup], #storybook-root button[aria-label*='Open']", "[role=dialog]"],
  ].map(([name, story, trigger, panel]) => ({
    name, story, observe: 700,
    async run(p) {
      await p.click(trigger);
      // first frame after mount vs settled position: a transform clash would start the panel at the page corner
      const first = await p.evalv(`new Promise(r => { let n = 0; const f = () => { const e = document.querySelector(${JSON.stringify(panel)}); if (e || ++n > 40) r(e ? e.getBoundingClientRect().toJSON() : null); else requestAnimationFrame(f); }; requestAnimationFrame(f); })`);
      await sleep(450);
      const last = await p.evalv(`(() => { const e=document.querySelector(${JSON.stringify(panel)}); return e ? e.getBoundingClientRect().toJSON() : null })()`);
      return { first, last };
    },
    normal: (r) => r.anims.some((a) => a.name === "enter" && a.dur === 200) && sitsStill(r) && r.first && r.last && Math.abs(r.first.left - r.last.left) < 12 && Math.abs(r.first.top - r.last.top) < 12,
    reduced: (r) => !r.anims.some((a) => a.name === "enter"),
  })),
  {
    name: "textfield-error-fades", story: "v2-components-textfield--usage", observe: 500,
    async run(p) {
      await p.click("#storybook-root button[aria-label='Clear input']");
      await p.click("#storybook-root button[type=submit]");
    },
    normal: (r) => r.anims.some((a) => a.name === "enter" && a.dur === 150),
    reduced: (r) => !r.anims.some((a) => a.name === "enter"),
  },
  {
    name: "readable-field-copy-pops", story: "v2-components-readablefield--overview", observe: 600,
    async run(p) { await p.click("#storybook-root button[aria-label='Copy to clipboard']"); },
    // 2026-10-04 refresh: Copy/Check cross-fade in a fixed box (opacity + scale .8 to 1, 180ms). Reduced motion drops the scale, keeps the fade.
    normal: (r) => r.anims.some((a) => a.kind === "CSSTransition" && a.name === "opacity" && a.dur === 180) && r.anims.some((a) => a.kind === "CSSTransition" && a.name === "transform" && a.dur === 180),
    reduced: (r) => r.anims.some((a) => a.name === "opacity" && a.dur === 180) && !r.anims.some((a) => a.name === "transform" && a.dur === 180),
  },
  {
    name: "tag-remove-hover", story: "v2-components-tag--removable",
    async run(p) {
      const sel = "#storybook-root button[aria-label]:not([disabled])";
      await p.mouse(sel, "move"); await sleep(450);
      return { hovered: await p.style(sel, "transform") };
    },
    normal: (r) => scaleOf(r.hovered) === 1.03,
    reduced: (r) => scaleOf(r.hovered) === 1,
  },
];

async function main() {
  let base = opt("url") || "http://localhost:6008";
  let staticServer;
  if (opt("static")) { const s = await serveStatic(opt("static")); staticServer = s.server; base = s.url; }
  const only = (opt("only") || "").split(",").filter(Boolean);
  const chromePath = opt("chrome") || ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"].find(fs.existsSync);
  if (!chromePath) throw new Error("No Chrome found; pass --chrome");
  const port = 9300 + Math.floor(Math.random() * 500);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "sb-motion-"));
  const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "--mute-audio", "about:blank"], { stdio: "ignore" });
  const cleanup = () => { try { chrome.kill("SIGKILL"); } catch { /* gone */ } try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } staticServer?.close(); };
  process.on("exit", cleanup);
  const cdp = await connect(port);
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  await cdp.send("Browser.grantPermissions", { origin: new URL(base).origin, permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch(() => {});
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

  const evalv = async (expression) => {
    const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const page = {
    evalv,
    style: (sel, prop) => evalv(`window.__style(${JSON.stringify(sel)}, ${JSON.stringify(prop)})`),
    async mouse(sel, type) {
      const c = await evalv(`window.__center(${JSON.stringify(sel)})`);
      if (!c) throw new Error(`no element for ${sel}`);
      const map = { move: "mouseMoved", down: "mousePressed", up: "mouseReleased" };
      await cdp.send("Input.dispatchMouseEvent", { type: map[type], x: c.x, y: c.y, button: type === "move" ? "none" : "left", buttons: type === "down" ? 1 : 0, clickCount: type === "move" ? 0 : 1 });
    },
    async click(sel) { await page.mouse(sel, "move"); await page.mouse(sel, "down"); await sleep(40); await page.mouse(sel, "up"); },
    async key(key) {
      const code = key === "Escape" ? 27 : 0;
      await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key, code: key, windowsVirtualKeyCode: code });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code: key, windowsVirtualKeyCode: code });
    },
  };

  const results = [];
  for (const mode of ["normal", "reduced"]) {
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: mode === "reduced" ? "reduce" : "no-preference" }] });
    for (const sc of SCENARIOS) {
      if (only.length && !only.some((o) => sc.name.includes(o))) continue;
      let outcome;
      try {
        await cdp.send("Page.navigate", { url: `${base}/iframe.html?id=${sc.story}&viewMode=story` });
        for (let i = 0; i < 80; i++) { await sleep(250); if (await evalv("!!document.querySelector('#storybook-root') && document.querySelector('#storybook-root').children.length>0 && document.readyState==='complete'").catch(() => false)) break; }
        await evalv(PAGE_HELPERS);
        await sleep(sc.loadObserve ? 0 : 700);
        await evalv("window.__start()");
        const extra = (await sc.run(page)) || {};
        await sleep(sc.observe || 400);
        const rec = await evalv("window.__stop()");
        const data = { ...rec, ...extra };
        const ok = sc[mode](data);
        outcome = { name: sc.name, mode, ok, anims: rec.anims.map((a) => `${a.kind === "CSSTransition" ? "transition" : "animation"} ${a.name} ${a.dur}ms${a.role ? " [" + a.role + "]" : ""}`), extra };
      } catch (e) {
        outcome = { name: sc.name, mode, ok: false, error: String(e.message || e).slice(0, 200) };
      }
      results.push(outcome);
      console.log(`${outcome.ok ? "PASS" : "FAIL"}  ${mode.padEnd(7)} ${sc.name}${outcome.ok ? "" : "  " + (outcome.error || JSON.stringify({ anims: outcome.anims, extra: outcome.extra }))}`);
    }
  }
  cdp.close();
  const failed = results.filter((r) => !r.ok);
  if (opt("out")) fs.writeFileSync(opt("out"), JSON.stringify(results, null, 2));
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  cleanup();
  process.exit(failed.length ? 1 : 0);
}
if (typeof process !== "undefined" && process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => { console.error(e); process.exit(2); });
}

/** Run the checks through an already connected Browser skill CDP capability. */
export async function runMotionScenarios(cdp, {
  base = "http://localhost:6008",
  only = [],
  modes = ["normal", "reduced"],
  scenarios = SCENARIOS,
  helpers = PAGE_HELPERS,
  onResult = () => {},
} = {}) {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const evalv = async (expression) => {
    const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const page = {
    evalv,
    style: (sel, prop) => evalv(`window.__style(${JSON.stringify(sel)}, ${JSON.stringify(prop)})`),
    async mouse(sel, type) {
      const c = await evalv(`window.__center(${JSON.stringify(sel)})`);
      if (!c) throw new Error(`no element for ${sel}`);
      const map = { move: "mouseMoved", down: "mousePressed", up: "mouseReleased" };
      await cdp.send("Input.dispatchMouseEvent", { type: map[type], x: c.x, y: c.y, button: type === "move" ? "none" : "left", buttons: type === "down" ? 1 : 0, clickCount: type === "move" ? 0 : 1 });
    },
    async click(sel) { await page.mouse(sel, "move"); await page.mouse(sel, "down"); await sleep(40); await page.mouse(sel, "up"); },
    async key(key) {
      const codes = { Escape: 27, Tab: 9, Enter: 13, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Home: 36, End: 35 };
      const code = codes[key] || 0;
      await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key, code: key, windowsVirtualKeyCode: code });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code: key, windowsVirtualKeyCode: code });
    },
  };
  const results = [];
  try {
    for (const mode of modes) {
      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: mode === "reduced" ? "reduce" : "no-preference" }] });
      for (const sc of scenarios) {
        if (only.length && !only.some((name) => sc.name.includes(name))) continue;
        let result;
        try {
          await cdp.send("Page.navigate", { url: `${base}/iframe.html?id=${sc.story}&viewMode=story` });
          let ready = false;
          for (let i = 0; i < 80; i++) {
            await sleep(250);
            ready = await evalv("!!document.querySelector('#storybook-root') && document.querySelector('#storybook-root').children.length>0 && document.readyState==='complete'").catch(() => false);
            if (ready) break;
          }
          if (!ready) throw new Error("Story did not mount before timeout");
          await evalv(helpers);
          await sleep(sc.loadObserve ? 0 : 700);
          await evalv("window.__start()");
          const extra = (await sc.run(page)) || {};
          await sleep(sc.observe || 400);
          const rec = await evalv("window.__stop()");
          const data = { ...rec, ...extra };
          result = { name: sc.name, story: sc.story, mode, ok: !!sc[mode](data), ...data };
        } catch (error) {
          result = { name: sc.name, story: sc.story, mode, ok: false, error: String(error.message || error) };
        }
        results.push(result);
        await onResult(result);
      }
    }
  } finally {
    await cdp.send("Emulation.setEmulatedMedia", { features: [] });
  }
  return results;
}


/** Supported browser runtime adapter: navigation and keys use its public UI API. */
export function createBrowserRuntimeAdapter(tab, capability) {
  return {
    async send(method, params = {}) {
      if (method === "Page.navigate") {
        await tab.goto(params.url);
        return {};
      }
      if (method === "Input.dispatchKeyEvent") {
        if (params.type === "keyDown") {
          await tab.cua.keypress({ keys: [params.key === "Escape" ? "ESC" : params.key] });
        }
        return {};
      }
      return capability.send(method, params);
    },
  };
}
