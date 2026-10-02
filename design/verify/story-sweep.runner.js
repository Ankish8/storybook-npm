/* eslint-disable */
/**
 * Runs INSIDE Storybook's preview iframe (iframe.html). story-sweep.mjs injects it over CDP; it can also be
 * pasted into a DevTools console on iframe.html. It drives the real Storybook channel, so play functions,
 * decorators, args/controls and docgen behave exactly as in the UI.
 *
 * window.__sweepStart(cfg)  starts the sweep (non-blocking), progress/results live on window.__sweep
 * window.__sweepGoto(id)    renders one story and resolves with its status (used for screenshots)
 */
(() => {
  if (window.__sweepStart) return "already installed";

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const hash = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  const ch = window.__STORYBOOK_ADDONS_CHANNEL__;
  const preview = window.__STORYBOOK_PREVIEW__;
  if (!ch || !preview) throw new Error("Not a Storybook preview iframe (channel/preview missing)");

  let ev = {};
  let logs = [];
  const EVENTS = [
    "storyRendered",
    "storyErrored",
    "storyThrewException",
    "playFunctionThrewException",
    "storyMissing",
    "storyUnchanged",
    "storyArgsUpdated",
    "docsRendered",
  ];
  EVENTS.forEach((n) =>
    ch.on(n, (p) => {
      (ev[n] = ev[n] || []).push(p);
    })
  );

  const fmt = (a) =>
    a
      .map((x) => {
        if (x && x.message) return x.message;
        if (typeof x === "string") return x;
        try {
          return JSON.stringify(x);
        } catch (e) {
          return String(x);
        }
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .slice(0, 320);
  ["error", "warn"].forEach((kind) => {
    const orig = console[kind].bind(console);
    console[kind] = (...a) => {
      logs.push({ kind, msg: fmt(a) });
      orig(...a);
    };
  });
  window.addEventListener("error", (e) => logs.push({ kind: "uncaught", msg: String(e.message).slice(0, 320) }));
  window.addEventListener("unhandledrejection", (e) =>
    logs.push({ kind: "rejection", msg: String((e.reason && e.reason.message) || e.reason).slice(0, 320) })
  );

  const store = () => preview.storyStoreValue || preview.storyStore;
  async function loadPrepared(id) {
    try {
      return await store().loadStory({ storyId: id });
    } catch (e) {
      return null;
    }
  }

  async function goto(id, timeout, viewMode) {
    ev = {};
    logs = [];
    viewMode = viewMode || "story";
    ch.emit("setCurrentStory", { storyId: id, viewMode });
    const t0 = performance.now();
    while (performance.now() - t0 < timeout) {
      if (viewMode === "docs" && (ev.docsRendered || []).includes(id)) return "rendered";
      if (viewMode === "story" && (ev.storyRendered || []).includes(id)) return "rendered";
      if (ev.playFunctionThrewException) return "play-threw";
      if (ev.storyThrewException) return "threw";
      if (ev.storyErrored) return "errored";
      if (ev.storyMissing) return "missing";
      if (ev.storyUnchanged) return "unchanged";
      await sleep(15);
    }
    return "timeout";
  }

  function measure() {
    const de = document.documentElement;
    const root = document.getElementById("storybook-root");
    const imgs = Array.from(document.images);
    const overlays = document.querySelectorAll(
      '[role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"],[role="tooltip"],[data-radix-popper-content-wrapper],[data-state="open"]'
    ).length;
    const textLen = (document.body.innerText || "").length;
    return {
      overflowX: de.scrollWidth > de.clientWidth + 1,
      docW: de.scrollWidth,
      clientW: de.clientWidth,
      docH: de.scrollHeight,
      empty: (!root || root.childElementCount === 0) && overlays === 0 && textLen < 3,
      errorDisplay: document.body.classList.contains("sb-show-errordisplay"),
      overlays,
      brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith("data:")).length,
    };
  }

  const dedupe = (list) => {
    const m = new Map();
    for (const l of list) {
      const k = l.kind + "|" + l.msg;
      m.set(k, { ...l, n: (m.get(k) ? m.get(k).n : 0) + 1 });
    }
    return Array.from(m.values()).slice(0, 8);
  };

  async function runAxe() {
    if (!window.axe) return null;
    const r = await window.axe.run(document.body, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      rules: {
        region: { enabled: false },
        "page-has-heading-one": { enabled: false },
        "landmark-one-main": { enabled: false },
      },
    });
    return r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      target: v.nodes[0].target.join(" ").slice(0, 160),
      html: v.nodes[0].html.slice(0, 220),
    }));
  }

  // ---- controls --------------------------------------------------------------------------------------------
  // Storybook conditional controls: argTypes.x.if = { arg, truthy | exists | eq | neq }
  function condMet(cond, args) {
    if (!cond || cond.global !== undefined) return true;
    const v = args[cond.arg];
    if ("exists" in cond) return (v !== undefined) === !!cond.exists;
    if ("truthy" in cond) return !!v === !!cond.truthy;
    if ("eq" in cond) return v === cond.eq;
    if ("neq" in cond) return v !== cond.neq;
    return !!v;
  }
  function controlKeys(prepared, args) {
    const at = prepared.argTypes || {};
    const c = (prepared.parameters && prepared.parameters.controls) || {};
    const test = (pat, k) => (Array.isArray(pat) ? pat.includes(k) : pat instanceof RegExp ? pat.test(k) : false);
    return Object.keys(at).filter((k) => {
      const a = at[k];
      if (!a || !a.control || a.control === false) return false;
      if (a.table && a.table.disable) return false;
      if (c.include && !test(c.include, k)) return false;
      if (c.exclude && test(c.exclude, k)) return false;
      if (!condMet(a.if, args || {})) return false;
      return true;
    });
  }
  function pickAlts(at, cur) {
    const ctl = at.control;
    const type = typeof ctl === "string" ? ctl : ctl && ctl.type;
    const opts = at.options;
    switch (type) {
      case "boolean":
        return [!cur];
      case "select":
      case "radio":
      case "inline-radio": {
        const list = Array.isArray(opts) ? opts : opts ? Object.keys(opts) : [];
        return list.filter((o) => o !== cur).slice(0, 4);
      }
      case "text":
        return [(cur == null ? "" : String(cur)) + "Z"];
      case "number":
      case "range": {
        const step = (ctl && ctl.step) || 1;
        let v = (Number(cur) || 0) + step;
        if (ctl && ctl.max != null && v > ctl.max) v = (Number(cur) || 0) - step;
        if (ctl && ctl.min != null && v < ctl.min) v = ctl.min;
        return [v];
      }
      case "color":
        return ["#ff0000"];
      default:
        return [];
    }
  }
  const domSig = () => hash(document.body.innerHTML.replace(/\s+/g, " "));
  const errCount = () => (ev.storyErrored || []).length + (ev.storyThrewException || []).length;

  async function testControls(id, prepared, cfg) {
    const out = { tested: 0, dead: [], errored: [], skipped: [], noisy: false };
    const initial = Object.assign({}, prepared.initialArgs);
    const keys = controlKeys(prepared, initial);
    if (!keys.length) return out;
    const s1 = domSig();
    await sleep(cfg.ctlSettle);
    if (s1 !== domSig()) {
      out.noisy = true;
      return out;
    }
    for (const k of keys) {
      const alts = pickAlts(prepared.argTypes[k], initial[k]);
      if (!alts.length) {
        out.skipped.push(k);
        continue;
      }
      let changed = false;
      let crashed = false;
      for (const v of alts) {
        const before = domSig();
        const e0 = errCount();
        ch.emit("updateStoryArgs", { storyId: id, updatedArgs: { [k]: v } });
        await sleep(cfg.ctlSettle);
        let after = domSig();
        if (after === before) {
          await sleep(cfg.ctlSettleSlow - cfg.ctlSettle);
          after = domSig();
        }
        if (errCount() > e0 || document.body.classList.contains("sb-show-errordisplay")) {
          crashed = true;
          break;
        }
        if (before !== after) {
          changed = true;
          break;
        }
      }
      out.tested++;
      if (crashed) {
        out.errored.push(k);
        ch.emit("resetStoryArgs", { storyId: id });
        ch.emit("forceRemount", { storyId: id });
        await sleep(300);
        continue;
      }
      if (!changed) out.dead.push(k);
      ch.emit("resetStoryArgs", { storyId: id, argNames: [k] });
      await sleep(cfg.ctlSettle);
    }
    return out;
  }

  // For each dead control, find a toggle/select whose change makes it effective (=> add `if: { arg }` to its argType).
  async function discoverDeps(id, prepared, dead, cfg) {
    const out = {};
    const initial = Object.assign({}, prepared.initialArgs);
    const typeOf = (a) => (typeof a.control === "string" ? a.control : a.control && a.control.type);
    const parents = controlKeys(prepared, initial).filter((k) => {
      if (dead.includes(k)) return false;
      const t = typeOf(prepared.argTypes[k]);
      return t === "boolean" || ((t === "select" || t === "radio" || t === "inline-radio") && pickAlts(prepared.argTypes[k], initial[k]).length <= 4);
    });
    for (const K of dead) {
      const altsK = pickAlts(prepared.argTypes[K], initial[K]).slice(0, 2);
      if (!altsK.length) continue;
      for (const P of parents) {
        for (const vp of pickAlts(prepared.argTypes[P], initial[P]).slice(0, 3)) {
          ch.emit("updateStoryArgs", { storyId: id, updatedArgs: { [P]: vp } });
          await sleep(cfg.ctlSettle);
          const base = domSig();
          let changed = false;
          for (const vk of altsK) {
            ch.emit("updateStoryArgs", { storyId: id, updatedArgs: { [K]: vk } });
            await sleep(cfg.ctlSettle);
            if (domSig() !== base) {
              changed = true;
              break;
            }
          }
          ch.emit("resetStoryArgs", { storyId: id });
          await sleep(cfg.ctlSettle);
          if (changed) {
            (out[K] = out[K] || []).push({ arg: P, value: vp });
            break;
          }
        }
        if (out[K] && out[K].length >= 2) break;
      }
    }
    return out;
  }

  // ---- one story -------------------------------------------------------------------------------------------
  async function sweepStory(id, cfg) {
    try {
      sessionStorage.setItem("__sweepCur", id);
    } catch (e) {
      /* storage unavailable */
    }
    const t0 = performance.now();
    const r = { id, status: null };
    r.status = await goto(id, cfg.renderTimeout, cfg.viewMode);
    await sleep(cfg.settle);
    const docs = cfg.viewMode === "docs";
    const prepared = docs ? null : await loadPrepared(id);
    r.hasPlay = !!(prepared && prepared.playFunction);
    r.metrics = measure();
    r.logs = dedupe(logs);
    if (r.status === "play-threw") r.playError = String((ev.playFunctionThrewException[0] && ev.playFunctionThrewException[0].message) || ev.playFunctionThrewException[0]).slice(0, 300);
    if (r.status === "threw") r.error = String((ev.storyThrewException[0] && ev.storyThrewException[0].message) || ev.storyThrewException[0]).slice(0, 300);
    const ok = r.status === "rendered" || r.status === "unchanged";
    if (docs) r.docs = { stories: document.querySelectorAll(".sb-story, [data-story-block]").length, tables: document.querySelectorAll("table").length, headings: document.querySelectorAll("h1,h2,h3").length };
    if (ok && cfg.axe) {
      try {
        r.axe = await runAxe();
      } catch (e) {
        r.axeError = String(e.message || e).slice(0, 200);
      }
    }
    if (ok && cfg.controls && prepared) {
      const before = logs.length;
      r.controls = await testControls(id, prepared, cfg);
      r.ctlLogs = dedupe(logs.slice(before));
      if (cfg.discover && r.controls.dead.length) r.controls.deps = await discoverDeps(id, prepared, r.controls.dead, cfg);
    }
    r.ms = Math.round(performance.now() - t0);
    return r;
  }

  window.__sweepGoto = async (id) => {
    const s = await goto(id, 20000);
    await sleep(400);
    return s;
  };
  window.__sweepStart = (cfg) => {
    const S = (window.__sweep = { total: cfg.ids.length, index: 0, current: null, done: false, fatal: null, results: [] });
    (async () => {
      try {
        // Enter every real story through a genuine transition: the page booted on the first story, and asking
        // Storybook for the story that is already showing returns "unchanged" without waiting for its play function.
        if (cfg.warm) await goto(cfg.warm, cfg.renderTimeout);
        for (const id of cfg.ids) {
          S.current = id;
          try {
            S.results.push(await sweepStory(id, cfg));
          } catch (e) {
            S.results.push({ id, status: "sweep-error", error: String((e && e.message) || e).slice(0, 300) });
          }
          S.index++;
        }
      } catch (e) {
        S.fatal = String((e && e.message) || e);
      }
      S.done = true;
    })();
    return true;
  };
  return "installed";
})();
