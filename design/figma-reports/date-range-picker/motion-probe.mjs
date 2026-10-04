#!/usr/bin/env node
/**
 * Month-change motion probe for DateRangePicker and DateTimePicker (both pickers share the same motion).
 * Reuses runMotionScenarios from design/verify/motion-probe.mjs with scenarios of its own, so the shared file is untouched.
 *
 *   node design/figma-reports/date-range-picker/motion-probe.mjs [--url http://localhost:6008]
 *
 * Each scenario runs twice (normal motion, then prefers-reduced-motion: reduce) and asserts:
 *   - opening the popover never plays the month motion (only the popover's own enter/fade runs);
 *   - Next slides the new month in from the right (+8px start), Prev from the left, 200ms, with a fade;
 *   - reduced motion keeps a 120ms opacity fade and no spatial movement;
 *   - re-opening after Next + Prev (month unchanged, direction stale) does not animate either.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runMotionScenarios, PAGE_HELPERS } from "../../verify/motion-probe.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const argv = process.argv.slice(2);
const base = argv.includes("--url") ? argv[argv.indexOf("--url") + 1] : "http://localhost:6008";

const RANGE = { story: "v2-components-daterangepicker--overview", trigger: '#storybook-root button[aria-haspopup="dialog"]', dialog: '[role="dialog"]' };
const DTP = { story: "v2-components-datetimepicker--overview", trigger: 'button[aria-label="Open calendar"]', dialog: '[role="dialog"]' };

// The day grid is the only div without a role that carries the 7-column grid and an animation; the popover is role=dialog.
const gridAnims = (r) => r.anims.filter((a) => !a.role && a.cls.includes("grid-cols-7"));
const gridSel = (d) => `${d.dialog} .grid-cols-7:last-child`;
const NEXT = (d) => `${d.dialog} button[aria-label="Next month"]`;
const PREV = (d) => `${d.dialog} button[aria-label="Previous month"]`;

// Computed translateX of the grid a frame after the click: tailwindcss-animate starts the slide at +/-8px and eases to 0.
const translateX = (page, d) =>
  page.evalv(`(() => { const g = document.querySelector(${JSON.stringify(gridSel(d))}); const t = getComputedStyle(g).transform; if (!t || t === "none") return 0; return new DOMMatrix(t).m41; })()`);

// getAnimations() is sampled once per frame, so a grid that mounts WITH its slide class and loses it one effect later
// would slip through. A MutationObserver sees the class at insertion time, before the first paint.
const WATCH_MOUNTS = `window.__mo = []; new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) { if (n.nodeType !== 1) continue; for (const e of [n, ...n.querySelectorAll(".grid-cols-7")]) { const c = String(e.className || ""); if (c.includes("grid-cols-7") && c.includes("animate-in")) window.__mo.push(c); } } }).observe(document.body, { childList: true, subtree: true });`;
const mounted = (page) => page.evalv("window.__mo");

const motionScenarios = (name, d) => [
  {
    name: `${name}-open-no-month-motion`, story: d.story,
    async run(p) { await p.evalv(WATCH_MOUNTS); await p.click(d.trigger); await sleep(700); return { mounted: await mounted(p) }; },
    normal: (r) => gridAnims(r).length === 0 && r.mounted.length === 0 && r.anims.some((a) => a.role === "dialog"),
    reduced: (r) => gridAnims(r).length === 0 && r.mounted.length === 0,
  },
  {
    name: `${name}-next-slides-in-from-right`, story: d.story,
    async run(p) {
      await p.click(d.trigger); await sleep(600);
      await p.evalv(WATCH_MOUNTS);
      await p.click(NEXT(d)); await sleep(30);
      return { tx: await translateX(p, d), mounted: await mounted(p) };
    },
    normal: (r) => gridAnims(r).some((a) => a.name === "enter" && a.dur === 200) && r.tx > 1 && r.tx <= 8.5 && r.mounted.length === 1 && r.mounted[0].includes("slide-in-from-right-2"),
    reduced: (r) => gridAnims(r).some((a) => a.name === "v2-fade-in" && a.dur === 120) && !gridAnims(r).some((a) => a.name === "enter") && Math.abs(r.tx) < 0.01,
  },
  {
    name: `${name}-prev-slides-in-from-left`, story: d.story,
    async run(p) {
      await p.click(d.trigger); await sleep(600);
      await p.evalv(WATCH_MOUNTS);
      await p.click(PREV(d)); await sleep(30);
      return { tx: await translateX(p, d), mounted: await mounted(p) };
    },
    normal: (r) => gridAnims(r).some((a) => a.name === "enter" && a.dur === 200) && r.tx < -1 && r.tx >= -8.5 && r.mounted.length === 1 && r.mounted[0].includes("slide-in-from-left-2"),
    reduced: (r) => gridAnims(r).some((a) => a.name === "v2-fade-in" && a.dur === 120) && !gridAnims(r).some((a) => a.name === "enter") && Math.abs(r.tx) < 0.01,
  },
  {
    // Next then Prev lands on the original month with a stale "prev" direction; reopening must still not animate the grid.
    name: `${name}-reopen-stale-direction-no-motion`, story: d.story,
    observe: 700,
    async run(p) {
      await p.click(d.trigger); await sleep(600);
      await p.click(NEXT(d)); await sleep(400);
      await p.click(PREV(d)); await sleep(400);
      await p.key("Escape"); await sleep(400);
      // Restart the recorder so only what the reopen itself plays is judged.
      await p.evalv("window.__stop(); window.__start()");
      await p.evalv(WATCH_MOUNTS);
      await p.click(d.trigger); await sleep(300);
      return { mounted: await mounted(p) };
    },
    normal: (r) => gridAnims(r).length === 0 && r.mounted.length === 0,
    reduced: (r) => gridAnims(r).length === 0 && r.mounted.length === 0,
  },
];

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
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); } };
  return { send: (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }), close: () => ws.close() };
}

const chromePath = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].find(fs.existsSync);
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "sb-dates-motion-"));
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "--mute-audio", "about:blank"], { stdio: "ignore" });
const cleanup = () => { try { chrome.kill("SIGKILL"); } catch { /* gone */ } try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ } };
process.on("exit", cleanup);

const cdp = await connect(port);
await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
const results = await runMotionScenarios(cdp, {
  base,
  scenarios: [...motionScenarios("date-range", RANGE), ...motionScenarios("date-time", DTP)],
  helpers: PAGE_HELPERS,
  onResult: (r) => console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.mode.padEnd(7)} ${r.name}${r.ok ? "" : "  " + (r.error || JSON.stringify({ anims: r.anims?.map((a) => `${a.name} ${a.dur}ms ${a.role || a.tag}`), tx: r.tx, mounted: r.mounted }))}`),
});
cdp.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
cleanup();
process.exit(failed.length ? 1 : 0);
