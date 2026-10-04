/**
 * FileUpload before/after scenarios (design/verify/capture.mjs).
 * Drag scenarios dispatch synthetic dragenter/dragover/dragleave events (a DataTransfer carrying one file) the way the browser
 * orders them when the pointer crosses between child elements, and read the drop zone's state after each:
 *   zoneBorder / zoneBg  computed border and background of the drop zone button
 * The reject scenarios use the Images-and-PDFs story (MIME-only accept) and drag a text/csv file; the accept scenario drags image/png.
 * Their before images were taken on the old build (no type check), where every drag looked like the neutral highlight.
 */
const S = (n) => `v2-components-fileupload--${n}`;
const ZONE = 'button[aria-label^="Choose"]';
const ZONE_P = ["width", "height", "background-color", "border-top-color", "border-top-style", "border-top-width", "border-radius", "padding", "gap", "transform", "outline-style", "outline-width", "outline-offset", "outline-color", "transition-property", "transition-duration"];
const m = () => ({
  "Drop zone": { sel: ZONE, props: ZONE_P },
  "Icon tile": { sel: `${ZONE} > span:first-child`, props: ["width", "height", "border-radius", "background-color", "border-top-color"] },
  "Message": { sel: '[id$="-helper"]', props: ["color", "font-size", "role", "opacity"] },
});

const drag = (mime = "text/csv") => `
  const root = document.querySelector("label").parentElement, zone = document.querySelector(${JSON.stringify(ZONE)}), icon = zone.querySelector("span"), text = zone.querySelectorAll("span")[2];
  const dt = new DataTransfer(); dt.items.add(new File(["a,b"], "contacts.csv", { type: ${JSON.stringify(mime)} }));
  const fire = (type, el) => el.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt }));
  // highlighted is read from the classes: the colours transition over 180ms, so computed style right after an event still shows the old value
  const read = (label) => { const s = getComputedStyle(zone); return { step: label, highlighted: zone.className.includes("border-semantic-border-accent"), rejecting: zone.className.includes("border-semantic-error-primary") }; };
  const rows = [];`;
const flicker = {
  // React handles dragenter/dragover as continuous events, so state is flushed asynchronously: wait 40ms (less than the ~50ms
  // between the browser's dragover events) after each group of events before reading the highlight.
  eval: `(async () => { ${drag()}
    const wait = () => new Promise((r) => setTimeout(r, 40));
    fire("dragenter", root); fire("dragover", root); await wait(); rows.push(read("enter root + over"));
    fire("dragenter", zone); fire("dragleave", root); fire("dragover", zone); await wait(); rows.push(read("pointer into zone (enter zone, leave root)"));
    fire("dragenter", icon); fire("dragleave", zone); await wait(); rows.push(read("zone -> icon (leave zone, before the next dragover)"));
    fire("dragover", icon); await wait(); rows.push(read("next dragover on icon"));
    fire("dragenter", text); fire("dragleave", icon); await wait(); rows.push(read("icon -> text (leave icon, before the next dragover)"));
    fire("dragover", text); await wait();
    fire("dragleave", text); await wait(); rows.push(read("pointer leaves the component (real leave)"));
    return rows; })()`,
  after: 400,
};
const rejectOver = (mime) => ({ eval: `(async () => { ${drag(mime)} fire("dragenter", root); fire("dragover", zone); await new Promise((r) => setTimeout(r, 400)); rows.push(read("dragging " + ${JSON.stringify(mime)})); return rows; })()`, after: 300 });
const rejectHold = (mime) => `(() => { ${drag(mime)} fire("dragenter", root); fire("dragover", zone); return true; })()`;

export default [
  { name: "default", story: S("overview"), measure: m() },
  { name: "hover", story: S("overview"), steps: [{ hover: ZONE }], measure: m() },
  { name: "focus", story: S("overview"), steps: [{ key: "Tab" }], measure: m() },
  { name: "error", story: S("error"), measure: m() },
  { name: "with-files", story: S("with-files"), measure: m() },
  { name: "disabled", story: S("disabled"), measure: m() },
  { name: "drag-over", story: S("overview"), steps: [{ eval: rejectHold("text/csv"), after: 500 }], settle: 100, measure: m() },
  { name: "drag-flicker", story: S("overview"), steps: [flicker], settle: 100, measure: m() },
  { name: "drag-reject-type", story: S("images-only"), steps: [{ eval: rejectHold("text/csv"), after: 500 }], settle: 100, measure: m() },
  { name: "drag-accept-type", story: S("images-only"), steps: [{ eval: rejectHold("image/png"), after: 500 }], settle: 100, measure: m() },
  { name: "narrow", story: S("overview"), width: 300, measure: m() },
];
