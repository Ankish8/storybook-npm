#!/usr/bin/env node
/**
 * Headless-Chrome sweep of Storybook stories (the repo has no working story test runner: @storybook/addon-vitest
 * is installed but needs Playwright + vitest browser mode). For every selected story it drives the REAL Storybook
 * channel and records: render status, play-function failures, console errors/warnings, horizontal overflow, empty
 * renders, broken images, axe-core violations, and "dead" controls (a visible control whose change does not alter
 * the DOM) or controls that crash the story.
 *
 *   node design/verify/story-sweep.mjs                              # all v2 stories on http://localhost:6008
 *   node design/verify/story-sweep.mjs --filter v2-components-button,v2-components-badge
 *   node design/verify/story-sweep.mjs --static storybook-static    # sweep a production build (no HMR interference)
 *   node design/verify/story-sweep.mjs --shot v2-components-button--states --shots /tmp/shots [--full]
 *
 * Options: --docs (sweep the Docs pages instead of stories), --discover (for dead controls, find the control they depend on), --url, --static <dir>, --filter <comma list of id prefixes/substrings, default "v2-">, --limit N,
 *   --no-controls, --no-axe, --settle ms (250), --ctl-settle ms (90), --timeout ms (20000), --viewport 1280x900,
 *   --out report.json, --ignore-log <regex>, --chrome <path>, --port N, --strict (axe/dead/overflow also fail).
 * Exit code 1 when any story fails to render, throws, fails its play function, shows the error display or times out.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const o = { controls: true, axe: true, shot: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    if (key === "no-controls") o.controls = false;
    else if (key === "no-axe") o.axe = false;
    else if (key === "full") o.full = true;
    else if (key === "strict") o.strict = true;
    else if (key === "discover") o.discover = true;
    else if (key === "docs") o.docs = true;
    else if (key === "shot") o.shot.push(argv[++i]);
    else o[key] = argv[++i];
  }
  return o;
}
const args = parseArgs(process.argv.slice(2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function serveStatic(dir) {
  const types = {
    ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
    ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".ico": "image/x-icon", ".map": "application/json",
  };
  const abs = path.resolve(dir);
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(abs, p);
    if (!f.startsWith(abs) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }))
  );
}

async function connectCdp(port) {
  let target;
  for (let i = 0; i < 80 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find((t) => t.type === "page");
    } catch {
      /* chrome still starting */
    }
    if (!target) await sleep(250);
  }
  if (!target) throw new Error("Chrome did not expose a page target");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      const { res, rej } = pending.get(d.id);
      pending.delete(d.id);
      d.error ? rej(new Error(d.error.message)) : res(d.result);
    } else if (d.method) {
      listeners.forEach((l) => l(d));
    }
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const i = ++id;
      pending.set(i, { res, rej });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  return { send, on: (fn) => listeners.push(fn), close: () => ws.close() };
}

async function main() {
  // ---- where is Storybook?
  let base = args.url || "http://localhost:6008";
  let staticServer = null;
  if (args.static) {
    const s = await serveStatic(args.static);
    staticServer = s.server;
    base = s.url;
  }
  const index = await (await fetch(`${base}/index.json`)).json();
  const filters = (args.filter || "v2-").split(",").map((s) => s.trim()).filter(Boolean);
  const wantType = args.docs ? "docs" : "story";
  let ids = Object.values(index.entries)
    .filter((e) => e.type === wantType && filters.some((f) => e.id.startsWith(f) || e.id.includes(f)))
    .map((e) => e.id);
  if (args.limit) ids = ids.slice(0, Number(args.limit));
  if (!ids.length && !args.shot.length) throw new Error(`No stories match ${filters.join(", ")}`);
  console.log(`Storybook ${base} | ${ids.length} stories selected`);

  // ---- Chrome
  const chromePath =
    args.chrome ||
    ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"].find(fs.existsSync);
  if (!chromePath) throw new Error("No Chrome/Chromium found; pass --chrome <path>");
  const port = Number(args.port) || 9300 + Math.floor(Math.random() * 500);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "sb-sweep-"));
  const chrome = spawn(
    chromePath,
    ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run",
      "--no-default-browser-check", "--disable-extensions", "--mute-audio", "about:blank"],
    { stdio: "ignore" }
  );
  const cleanup = () => {
    try { chrome.kill("SIGKILL"); } catch { /* already gone */ }
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ }
    if (staticServer) staticServer.close();
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => { cleanup(); process.exit(130); });

  const cdp = await connectCdp(port);
  const evalPage = async (expression, opts = {}) => {
    const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: !!opts.await });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const [vw, vh] = (args.viewport || "1280x900").split("x").map(Number);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: vw, height: vh, deviceScaleFactor: 1, mobile: false });

  const axeSource = args.axe ? fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8") : null;
  const runnerSource = fs.readFileSync(path.join(here, "story-sweep.runner.js"), "utf8");
  const navLog = [];
  cdp.on((d) => {
    if (d.method === "Page.frameNavigated" && !d.params.frame.parentId) navLog.push(d.params.frame.url);
    if (d.method === "Inspector.targetCrashed") navLog.push("TARGET CRASHED");
  });
  async function boot(storyId) {
    await cdp.send("Page.navigate", { url: `${base}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=${args.docs ? "docs" : "story"}` });
    let ready = false;
    for (let i = 0; i < 120 && !ready; i++) {
      await sleep(500);
      try { ready = await evalPage("!!(window.__STORYBOOK_PREVIEW__ && window.__STORYBOOK_ADDONS_CHANNEL__ && document.readyState === 'complete')"); } catch { /* navigating */ }
    }
    if (!ready) throw new Error("Storybook preview did not initialise");
    await sleep(1500);
    if (axeSource) await evalPage(axeSource);
    await evalPage(runnerSource);
  }
  await boot(ids[0] || args.shot[0]);

  // ---- screenshots only
  if (args.shot.length) {
    const dir = path.resolve(args.shots || path.join(os.tmpdir(), "sb-shots"));
    fs.mkdirSync(dir, { recursive: true });
    for (const id of args.shot) {
      const status = await evalPage(`window.__sweepGoto(${JSON.stringify(id)})`, { await: true });
      const params = { format: "png" };
      if (args.full) {
        const m = await cdp.send("Page.getLayoutMetrics");
        const w = Math.ceil(m.cssContentSize.width), h = Math.min(Math.ceil(m.cssContentSize.height), 6000);
        params.captureBeyondViewport = true;
        params.clip = { x: 0, y: 0, width: w, height: h, scale: 1 };
      }
      const shot = await cdp.send("Page.captureScreenshot", params);
      const file = path.join(dir, `${id}.png`);
      fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
      console.log(`${status.padEnd(9)} ${file}`);
    }
    if (!ids.length) { cdp.close(); cleanup(); return; }
  }

  // ---- sweep (self-healing: a story that reloads or crashes the page is recorded and skipped)
  const cfg = {
    ids, axe: !!args.axe, controls: !!args.controls && !args.docs, discover: !!args.discover, viewMode: args.docs ? "docs" : "story",
    settle: Number(args.settle) || 250, ctlSettle: Number(args["ctl-settle"]) || 90, ctlSettleSlow: 420,
    renderTimeout: Number(args.timeout) || 20000,
  };
  const idSet = new Set(ids);
  cfg.warm = Object.values(index.entries).find((e) => e.type === wantType && !idSet.has(e.id))?.id || null;
  const results = [];
  const done = new Set();
  const t0 = Date.now();
  let lastPrint = 0;
  let reloads = 0;
  let todo = ids.slice();
  while (todo.length) {
    if (reloads) await boot(todo[0]);
    const warm = cfg.warm && cfg.warm !== todo[0] ? cfg.warm : Object.values(index.entries).find((e) => e.type === wantType && e.id !== todo[0])?.id;
    await evalPage(`window.__sweepStart(${JSON.stringify({ ...cfg, warm, ids: todo })})`);
    let fetched = 0;
    let lastCur = null;
    for (;;) {
      await sleep(700);
      let st = null;
      try {
        st = JSON.parse(await evalPage("JSON.stringify(window.__sweep ? {i: window.__sweep.index, n: window.__sweep.total, cur: window.__sweep.current, done: window.__sweep.done} : null)"));
      } catch { /* page is navigating or gone */ }
      if (!st) {
        // The page lost its state: a story reloaded / navigated / crashed it.
        reloads++;
        let culprit = lastCur;
        try { await sleep(1500); culprit = (await evalPage("sessionStorage.getItem('__sweepCur')")) || lastCur; } catch { /* keep lastCur */ }
        if (!culprit || done.has(culprit)) culprit = todo.find((id) => !done.has(id));
        console.log(`  !! page reloaded while running ${culprit} (${navLog.slice(-2).join(" -> ")}); recording and resuming`);
        results.push({ id: culprit, status: "page-reloaded", navigation: navLog.slice(-3) });
        done.add(culprit);
        todo = ids.filter((id) => !done.has(id));
        break;
      }
      if (st.i > fetched) {
        const chunk = JSON.parse(await evalPage(`JSON.stringify(window.__sweep.results.slice(${fetched}, ${st.i}))`));
        for (const r of chunk) { results.push(r); done.add(r.id); }
        fetched = st.i;
      }
      lastCur = st.cur;
      if (Date.now() - lastPrint > 20000) {
        lastPrint = Date.now();
        console.log(`  ${done.size}/${ids.length}  ${Math.round((Date.now() - t0) / 1000)}s  ${st.cur}`);
      }
      if (st.done) { todo = []; break; }
    }
  }
  cdp.close();
  cleanup();

  // ---- report
  const ignore = args["ignore-log"] ? new RegExp(args["ignore-log"]) : null;
  const component = (id) => id.replace(/^v2-components-/, "").replace(/--.*/, "");
  const fails = results.filter((r) => !["rendered", "unchanged"].includes(r.status) || r.metrics?.errorDisplay);
  const logMap = new Map();
  for (const r of results) {
    for (const l of [...(r.logs || []), ...(r.ctlLogs || [])]) {
      if (ignore && ignore.test(l.msg)) continue;
      const k = `${l.kind}: ${l.msg}`;
      const e = logMap.get(k) || { n: 0, stories: new Set() };
      e.n += l.n; e.stories.add(r.id); logMap.set(k, e);
    }
  }
  const overflow = results.filter((r) => r.metrics?.overflowX);
  const empty = results.filter((r) => r.metrics?.empty && ["rendered", "unchanged"].includes(r.status));
  const axeMap = new Map();
  for (const r of results) for (const v of r.axe || []) {
    const e = axeMap.get(v.id) || { impact: v.impact, stories: new Set(), comps: new Set(), sample: v };
    e.stories.add(r.id); e.comps.add(component(r.id)); axeMap.set(v.id, e);
  }
  const dead = results.filter((r) => r.controls?.dead?.length);
  const ctlErr = results.filter((r) => r.controls?.errored?.length);
  const noisy = results.filter((r) => r.controls?.noisy);

  const out = path.resolve(args.out || path.join(here, "story-sweep-report.json"));
  fs.writeFileSync(out, JSON.stringify({ base, when: new Date().toISOString(), cfg, results }, null, 1));
  const count = (s) => results.filter((r) => r.status === s).length;
  console.log(`\n=== ${results.length} stories | rendered ${count("rendered") + count("unchanged")} | errored ${count("errored")} | threw ${count("threw")} | play-threw ${count("play-threw")} | timeout ${count("timeout")} | missing ${count("missing")} | sweep-error ${count("sweep-error")} | page-reloaded ${count("page-reloaded")}`);
  console.log(`play functions: ${results.filter((r) => r.hasPlay).length} stories | controls tested: ${results.reduce((a, r) => a + (r.controls?.tested || 0), 0)} | report: ${out}`);
  for (const r of fails) console.log(`FAIL ${r.status.padEnd(9)} ${r.id}  ${r.error || r.playError || (r.navigation || []).join(" -> ")}`);
  console.log(`\n--- console (${logMap.size} distinct)`);
  for (const [k, e] of [...logMap].sort((a, b) => b[1].n - a[1].n).slice(0, 25)) console.log(`${String(e.n).padStart(4)}x in ${String(e.stories.size).padStart(3)} stories  ${k.slice(0, 200)}`);
  console.log(`\n--- horizontal overflow (${overflow.length})`);
  for (const r of overflow) console.log(`  ${r.id}  doc ${r.metrics.docW} > ${r.metrics.clientW}`);
  console.log(`--- empty renders (${empty.length})`); for (const r of empty) console.log(`  ${r.id}`);
  console.log(`--- broken images (${results.filter((r) => r.metrics?.brokenImages).length})`);
  console.log(`\n--- axe (${axeMap.size} rules)`);
  for (const [id, e] of [...axeMap].sort((a, b) => b[1].stories.size - a[1].stories.size)) console.log(`${String(e.stories.size).padStart(4)} stories ${e.impact?.padEnd(8)} ${id}  [${[...e.comps].slice(0, 6).join(", ")}${e.comps.size > 6 ? ", ..." : ""}]  e.g. ${e.sample.target}`);
  console.log(`\n--- dead controls (${dead.length} stories)`);
  for (const r of dead) console.log(`  ${r.id}: ${r.controls.dead.join(", ")}`);
  const depStories = results.filter((r) => r.controls?.deps && Object.keys(r.controls.deps).length);
  if (depStories.length) {
    console.log(`--- dead controls that become effective when another control changes (suggested \`if\` conditions)`);
    for (const r of depStories) for (const [k, ps] of Object.entries(r.controls.deps)) console.log(`  ${r.id}: ${k}  <-  ${ps.map((p) => `${p.arg}=${JSON.stringify(p.value)}`).join(" or ")}`);
  }
  console.log(`--- controls that crash the story (${ctlErr.length})`);
  for (const r of ctlErr) console.log(`  ${r.id}: ${r.controls.errored.join(", ")}`);
  console.log(`--- stories whose DOM changes on its own (controls not testable) (${noisy.length})`);
  for (const r of noisy.slice(0, 20)) console.log(`  ${r.id}`);

  const hard = fails.length > 0;
  const soft = args.strict && (overflow.length || axeMap.size || dead.length || ctlErr.length || empty.length);
  process.exit(hard || soft ? 1 : 0);
}

main().catch((e) => {
  console.error(e.stack || e);
  process.exit(2);
});
