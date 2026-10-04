/**
 * Extra motion proof for the v2 tab rail and reduced-motion opacity policy.
 * Import this module from the Browser skill's Node REPL, after reading the CDP
 * capability documentation. It does not launch or connect to a browser itself.
 *
 * const probe = await import('/absolute/repo/design/verify/motion-polish-probe.mjs');
 * const capability = await tab.capabilities.get('cdp');
 * const baseline = await import('/absolute/repo/design/verify/motion-probe.mjs');
 * const cdp = baseline.createBrowserRuntimeAdapter(tab, capability);
 * const results = await probe.runPolishProbe(cdp, { base: 'http://localhost:6008' });
 *
 * Each UI change uses real CDP mouse/keyboard input. Temporary frame recorders
 * are removed by navigation; the media override is restored in finally.
 */
import { PAGE_HELPERS, SCENARIOS, runMotionScenarios } from "./motion-probe.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const near = (left, right, tolerance = 0.5) =>
  Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= tolerance;

export const POLISH_HELPERS = `${PAGE_HELPERS}
(() => {
  const originalStart = window.__start;
  const originalStop = window.__stop;
  let collecting = false;
  let frames = [];
  window.__tabGeometry = () => {
    const list = document.querySelector('#storybook-root [role="tablist"]');
    if (!list) return null;
    const selected = [...list.querySelectorAll('[role="tab"]')].find(tab => tab.closest('[role="tablist"]') === list && tab.getAttribute('aria-selected') === 'true');
    if (!selected) return null;
    const l = list.getBoundingClientRect();
    const t = selected.getBoundingClientRect();
    const style = getComputedStyle(list);
    const rail = getComputedStyle(list, '::after');
    const axis = name => parseFloat(style.getPropertyValue('--v2-tab-' + name));
    return {
      time: performance.now(), selected: selected.textContent.trim(),
      x: axis('x'), y: axis('y'), width: axis('width'), height: axis('height'),
      targetX: t.left - l.left + list.scrollLeft - list.clientLeft,
      targetY: t.top - l.top + list.scrollTop - list.clientTop,
      targetWidth: t.width, targetHeight: t.height,
      railTransform: rail.transform, railWidth: parseFloat(rail.width),
      railHeight: parseFloat(rail.height), railOpacity: parseFloat(rail.opacity),
      enabled: list.getAttribute('data-motion-indicator') === 'true',
      orientation: list.getAttribute('data-orientation'),
    };
  };
  window.__start = () => {
    originalStart();
    collecting = true;
    frames = [];
    const read = () => {
      if (!collecting) return;
      const frame = window.__tabGeometry();
      if (frame) frames.push(frame);
      requestAnimationFrame(read);
    };
    read();
  };
  window.__stop = () => {
    collecting = false;
    return { ...originalStop(), tabFrames: frames };
  };
})();`;

const settled = (sample) =>
  sample?.enabled &&
  near(sample.x, sample.targetX) &&
  near(sample.y, sample.targetY) &&
  near(sample.width, sample.targetWidth) &&
  near(sample.height, sample.targetHeight) &&
  sample.railOpacity === 1;

const changedFrames = (result, axis) => {
  const before = result.before?.[axis];
  const target = result.after?.[`target${axis[0].toUpperCase()}${axis.slice(1)}`];
  if (!Number.isFinite(before) || !Number.isFinite(target)) return [];
  return (result.tabFrames || []).filter(
    (frame) => frame.selected === result.after.selected &&
      !near(frame[axis], before, 0.1) && !near(frame[axis], target, 0.1)
  );
};

function springScenario(name, story, axis) {
  return {
    name, story, observe: 650,
    async run(page) {
      const before = await page.evalv("window.__tabGeometry()");
      await page.click('#storybook-root [role="tab"][aria-selected="false"]:not([disabled])');
      await sleep(550);
      return { before, after: await page.evalv("window.__tabGeometry()") };
    },
    normal: (result) => settled(result.after) && changedFrames(result, axis).length >= 2,
    reduced: (result) => settled(result.after) && changedFrames(result, axis).length === 0,
  };
}

export const POLISH_SCENARIOS = [
  springScenario("tabs-horizontal-indicator-spring", "v2-components-tabs--horizontal", "x"),
  springScenario("tabs-full-width-indicator-spring", "v2-components-tabs--full-width-with-badges", "x"),
  springScenario("tabs-auto-width-indicator-spring", "v2-components-tabs--auto-width", "width"),
  springScenario("tabs-vertical-indicator-spring", "v2-components-tabs--vertical", "y"),
  {
    name: "tabs-interrupted-indicator-spring", story: "v2-components-tabs--horizontal", observe: 650,
    async run(page) {
      const before = await page.evalv("window.__tabGeometry()");
      await page.click('#storybook-root [role="tab"]:last-child');
      await page.click('#storybook-root [role="tab"]:first-child');
      await sleep(550);
      return { before, after: await page.evalv("window.__tabGeometry()") };
    },
    normal: (result) => settled(result.after) &&
      result.after.selected === result.before.selected &&
      result.tabFrames.some((frame) => frame.x > result.before.x + 1) &&
      result.tabFrames.every((frame) => Number.isFinite(frame.x)),
    reduced: (result) => settled(result.after) &&
      result.after.selected === result.before.selected &&
      result.tabFrames.every((frame) => near(frame.x, frame.targetX)),
  },
  {
    name: "tabs-manual-focus-keeps-indicator", story: "v2-components-tabs--manual-activation", observe: 500,
    async run(page) {
      await page.click('#storybook-root [role="tab"][aria-selected="true"]');
      const before = await page.evalv("window.__tabGeometry()");
      await page.key("ArrowRight");
      // Radix moves focus in a deferred task. Observe it before checking that
      // manual activation left selection and the decorative rail unchanged.
      const focused = await page.evalv(`new Promise(resolve => {
        let frames = 0;
        const read = () => {
          const text = document.activeElement?.textContent.trim();
          if (text !== ${JSON.stringify(before.selected)} || ++frames >= 20) resolve(text);
          else requestAnimationFrame(read);
        };
        requestAnimationFrame(read);
      })`);
      const focusedGeometry = await page.evalv("window.__tabGeometry()");
      await page.key("Enter");
      await sleep(550);
      return { before, focused, focusedGeometry, after: await page.evalv("window.__tabGeometry()") };
    },
    normal: (result) => result.focused !== result.before.selected &&
      near(result.focusedGeometry.x, result.before.x) &&
      result.focusedGeometry.selected === result.before.selected && settled(result.after),
    reduced: (result) => result.focused !== result.before.selected &&
      near(result.focusedGeometry.x, result.before.x) && settled(result.after),
  },
  {
    name: "dialog-reduced-opacity-only", story: "v2-components-dialog--default", observe: 750,
    async run(page) {
      await page.click("#storybook-root button");
      await sleep(450);
      await page.key("Escape");
    },
    normal: (result) => result.anims.some((animation) => animation.name === "enter" && animation.role === "dialog"),
    reduced: (result) => result.anims.some((animation) => animation.name === "v2-fade-in" && animation.role === "dialog") &&
      result.anims.some((animation) => animation.name === "v2-fade-out" && animation.role === "dialog") &&
      !result.anims.some((animation) => animation.name === "enter" || animation.name === "exit"),
  },
];

export function runPolishProbe(cdp, options = {}) {
  const { includeBaseline = true, ...rest } = options;
  return runMotionScenarios(cdp, {
    ...rest,
    scenarios: [...(includeBaseline ? SCENARIOS : []), ...POLISH_SCENARIOS],
    helpers: POLISH_HELPERS,
  });
}
