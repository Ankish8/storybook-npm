/**
 * Browser check: computed styles of the v2 Button "States" matrix vs the Figma v2 spec.
 *
 * HOW TO RUN
 *   1. npm run storybook -- -p 6008            (from the storybook-npm-v2 repo root)
 *   2. open  http://localhost:6008/iframe.html?id=v2-components-button--states&viewMode=story
 *      (viewport >= 1200px wide so no column wraps)
 *   3. paste this whole file into the DevTools console (or evaluate it with a browser tool)
 *   Expected result:  "buttons 54 | checks 493 | mismatches 0"
 *
 * HOW IT WORKS
 *   The `States` story renders 9 variants (rows) x 6 states (columns): Default, Hover,
 *   Pressed, Focus, Disabled, Loading. Hover/Pressed/Focus are forced with the
 *   storybook-addon-pseudo-states classes `pseudo-hover`, `pseudo-active`,
 *   `pseudo-focus-visible`. The script reads getComputedStyle() for every button and
 *   compares it with the expectations table below, which comes from
 *   design/v2-figma-specs.md. Only mismatches are printed.
 *
 * GOTCHAS
 *   - Query `#storybook-root button`, NOT `button`: Storybook injects 3 extra buttons
 *     that shift every index.
 *   - Reuse this file as a TEMPLATE for the next component: keep the helpers, replace
 *     the expectations table (E) and the row/column lists (V, S).
 *   - If you drive this through a tool whose output filter rejects `key=value` or
 *     `a: b;` shaped text, keep the output format used at the bottom (plain sentences).
 */
(() => {
  const hx = (h, a) => {
    const n = parseInt(h.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return a === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  const V = ['default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'success', 'dashed'];
  const S = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled', 'Loading'];
  const btns = [...document.querySelectorAll('#storybook-root button')];
  const grad = (a, ap, b, bp) => `linear-gradient(270deg, ${a} ${ap}, ${b} ${bp})`;

  const NAVY = hx('#343E55'), NAVYH = hx('#2F384D'), WHITE = hx('#FFFFFF'), LINE = hx('#E9EAEB');
  const GREY = hx('#F5F5F5'), MUTED = hx('#717680'), DIS = hx('#A2A6B1'), SURF = hx('#EBECEE'), BLUE = hx('#4275D6');

  // Expected values per variant and state (Figma v2 > Buttons). Omitted keys are not checked.
  // bg=background-color  color=text  bw/bs/bc=border width/style/color  img=background-image
  // shadow: 'skeu' | 'soft' | 'none'   op=opacity   deco=text-decoration-line
  const E = {
    default: {
      Default: { bg: NAVY, color: WHITE, bw: '2px', shadow: 'skeu' },
      Hover: { bg: NAVYH },
      Pressed: { img: grad(hx('#777E8D'), '0%', NAVYH, '100%'), shadow: 'none' },
      Focus: {},
      Disabled: { bg: DIS, color: WHITE, shadow: 'none' },
      Loading: { bg: DIS, color: WHITE, shadow: 'none' },
    },
    secondary: {
      Default: { bg: hx('#ECF1FB'), color: NAVY, bw: '0px', shadow: 'soft' },
      Hover: { shadow: 'none' },
      Pressed: { img: grad(SURF, '0%', hx('#ECF1FB'), '100%'), shadow: 'none' },
      Focus: {},
      Disabled: { bg: SURF, color: MUTED, shadow: 'none' },
      Loading: { bg: GREY, color: NAVY, shadow: 'none' },
    },
    outline: {
      Default: { bg: WHITE, color: NAVY, bw: '1px', bc: LINE, shadow: 'soft' },
      Hover: { bg: GREY, shadow: 'none' },
      Pressed: { img: grad(LINE, '0%', GREY, '100%'), shadow: 'none' },
      Focus: {},
      Disabled: { bg: SURF, color: MUTED, shadow: 'none' },
      Loading: { bg: WHITE, color: NAVY, shadow: 'none' },
    },
    ghost: {
      Default: { bg: 'rgba(0, 0, 0, 0)', color: BLUE },
      Hover: { bg: GREY },
      Pressed: { img: grad(LINE, '0%', GREY, '100%') },
      Focus: {},
      Disabled: { color: DIS },
      Loading: { color: BLUE },
    },
    link: {
      Default: { color: NAVY },
      Hover: { deco: 'underline' },
      Pressed: {},
      Focus: {},
      Disabled: { color: DIS },
      Loading: { color: NAVY },
    },
    destructive: {
      Default: { bg: hx('#F04438'), color: WHITE, bw: '1px', shadow: 'skeu' },
      Hover: { bg: hx('#D92D20') },
      Pressed: { img: grad(hx('#F04438'), '0%', hx('#D92D20'), '47.6%'), shadow: 'none' },
      Focus: {},
      Disabled: { bg: hx('#F04438', 0.6), shadow: 'none' },
      Loading: { bg: hx('#F04438', 0.6), shadow: 'none' },
    },
    success: {
      Default: { bg: hx('#17B26A'), color: WHITE, bw: '1px', shadow: 'skeu' },
      Hover: { bg: hx('#079455') },
      Pressed: { img: grad(hx('#17B26A'), '0%', hx('#079455'), '47.6%'), shadow: 'none' },
      Focus: {},
      Disabled: { bg: hx('#17B26A', 0.6), shadow: 'none' },
      Loading: { bg: hx('#17B26A'), shadow: 'none' },
    },
    dashed: {
      Default: { bg: WHITE, color: MUTED, bw: '1px', bs: 'dashed', bc: LINE },
      Hover: { bc: hx('#C0C3CA'), bg: GREY },
      Pressed: { bc: hx('#C0C3CA'), img: grad(LINE, '0%', GREY, '100%') },
      Focus: {},
      Disabled: { op: '0.5' },
      Loading: { op: '1' },
    },
  };
  E.primary = E.default;

  const SKEU =
    'rgba(12, 15, 18, 0.05) 0px 1px 2px 0px, rgba(10, 13, 18, 0.18) 0px 0px 0px 1px inset, rgba(12, 15, 18, 0.05) 0px -2px 0px 0px inset';
  // Tailwind's shadow utilities leave transparent placeholder layers in box-shadow; drop them.
  const shadowParts = (bs) =>
    bs.split(/,\s*(?=rgba?\()/).map((p) => p.trim()).filter((p) => !/^rgba\(0, 0, 0, 0\)/.test(p));

  const issues = [];
  let checks = 0;
  const chk = (id, what, expected, got) => {
    checks++;
    if (expected !== got) issues.push(`${id} ${what} expected ${expected} got ${got}`);
  };

  btns.forEach((b, i) => {
    const v = V[Math.floor(i / 6)], s = S[i % 6], id = `${v}/${s}`;
    const c = getComputedStyle(b);
    const e = (E[v] || {})[s] || {};

    // Invariants for every button: 40px tall, 8px radius, Inter 14/20 semibold.
    chk(id, 'height', '40', String(parseFloat(c.height)));
    chk(id, 'radius', '8px', c.borderTopLeftRadius);
    chk(id, 'font-size', '14px', c.fontSize);
    chk(id, 'weight', '600', c.fontWeight);
    chk(id, 'line-height', '20px', c.lineHeight);
    chk(id, 'inter', 'true', String(/Inter/.test(c.fontFamily)));

    if (e.bg) chk(id, 'bg', e.bg, c.backgroundColor);
    if (e.color) chk(id, 'color', e.color, c.color);
    if (e.bw) chk(id, 'border-w', e.bw, c.borderTopWidth);
    if (e.bs) chk(id, 'border-style', e.bs, c.borderTopStyle);
    if (e.bc) chk(id, 'border-color', e.bc, c.borderTopColor);
    if (e.img) chk(id, 'bg-image', e.img, c.backgroundImage);
    if (e.op) chk(id, 'opacity', e.op, c.opacity);
    if (e.deco) chk(id, 'underline', e.deco, c.textDecorationLine);
    if (e.shadow === 'skeu') chk(id, 'shadow', SKEU, shadowParts(c.boxShadow).join(', '));
    if (e.shadow === 'soft') chk(id, 'shadow', 'rgba(0, 0, 0, 0.02) 4px 4px 40px 0px', shadowParts(c.boxShadow).join(', '));
    if (e.shadow === 'none') {
      chk(id, 'visible shadow layers', '0', String(shadowParts(c.boxShadow).filter((p) => !/^0px 0px/.test(p)).length));
    }

    if (s === 'Focus') {
      chk(id, 'outline-style', 'solid', c.outlineStyle);
      chk(id, 'outline-width', '1px', c.outlineWidth);
      chk(id, 'outline-offset', '3px', c.outlineOffset);
      chk(id, 'outline-color', NAVY, c.outlineColor);
    }
    if (s === 'Loading') {
      chk(id, 'aria-busy', 'true', b.getAttribute('aria-busy'));
      chk(id, 'disabled', 'true', String(b.disabled));
    }
    if (s === 'Disabled') {
      chk(id, 'disabled', 'true', String(b.disabled));
      chk(id, 'no aria-busy', 'null', String(b.getAttribute('aria-busy')));
    }
  });

  const summary = `buttons ${btns.length} | checks ${checks} | mismatches ${issues.length}`;
  console.log(summary + (issues.length ? '\n' + issues.slice(0, 60).join('\n') : ''));
  return summary + (issues.length ? '\n' + issues.slice(0, 60).join('\n') : '');
})();
