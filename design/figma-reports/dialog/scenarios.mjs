// Dialog + modal wrappers. Selectors avoid class names so the same file measures both versions.
const BOX = ["background-color", "border-top-left-radius", "border-top-width", "border-top-color", "box-shadow", "overflow-y", "max-height", "width"];
const HEADER = ["position", "top", "z-index", "background-color", "padding-top", "padding-left", "border-bottom-width", "border-bottom-color", "height"];
const FOOTER = ["position", "bottom", "z-index", "background-color", "padding-left", "padding-bottom", "border-top-width", "height"];
const CLOSE = ["position", "top", "right", "z-index", "width", "height", "border-radius", "background-color", "color", "outline-style", "outline-offset", "transition-duration"];
const ICON = ["width", "height", "color"];

const OPEN_DIALOG = { click: "#storybook-root button[aria-haspopup=dialog]", after: 700 };
// Real elements measured by structure, not by class.
const dialogMeasure = (extra = {}) => ({
  "Dialog panel": { sel: "[role=dialog]", props: BOX },
  "Header": { sel: "[role=dialog] [data-dialog-section=header]", props: HEADER },
  "Footer": { sel: "[role=dialog] [data-dialog-section=footer]", props: FOOTER },
  "Corner close button": { sel: "[role=dialog] > button:last-child", props: CLOSE },
  "Corner close icon": { sel: "[role=dialog] > button:last-child svg", props: ICON },
  ...extra,
});
const modalMeasure = (extra = {}) => ({
  "Dialog panel": { sel: "[role=dialog]", props: BOX },
  "Header": { sel: "[role=dialog] > div:first-child", props: HEADER },
  "Footer": { sel: "[role=dialog] > div:last-of-type", props: FOOTER },
  "Header close button": { sel: "[role=dialog] button[aria-label=Close]", props: CLOSE },
  "Header close icon": { sel: "[role=dialog] button[aria-label=Close] svg", props: ICON },
  ...extra,
});
const formMeasure = (extra = {}) => ({
  "Dialog panel": { sel: "[role=dialog]", props: BOX },
  "Header": { sel: "[role=dialog] > div:first-child", props: HEADER },
  "Footer": { sel: "[role=dialog] > div:nth-child(3)", props: FOOTER },
  "Corner close button": { sel: "[role=dialog] > button:last-child", props: CLOSE },
  "Corner close icon": { sel: "[role=dialog] > button:last-child svg", props: ICON },
  ...extra,
});
const scrollTo = (n) => ({ eval: `(()=>{const d=document.querySelector('[role=dialog]');d.scrollTop=${n === "end" ? "d.scrollHeight" : n};return [d.scrollTop,d.scrollHeight,d.clientHeight]})()`, after: 500 });
const FORM_OPEN = { clickText: "Edit profile", after: 700 };
const LONG_OPEN = { clickText: "Edit preferences", after: 700 };

export default [
  { name: "01-dialog-small", story: "v2-components-dialog--small", height: 600, steps: [OPEN_DIALOG], measure: dialogMeasure() },
  { name: "02-dialog-default", story: "v2-components-dialog--default", height: 600, steps: [OPEN_DIALOG], measure: dialogMeasure() },
  { name: "03-dialog-close-hover", story: "v2-components-dialog--default", height: 600, steps: [OPEN_DIALOG, { hover: "[role=dialog] > button:last-child" }], measure: dialogMeasure() },
  { name: "04-dialog-close-focus", story: "v2-components-dialog--default", height: 600, steps: [OPEN_DIALOG, { key: "Tab" }, { key: "Tab" }, { eval: "document.activeElement.textContent.trim()||document.activeElement.tagName" }], measure: dialogMeasure() },
  { name: "05-dialog-narrow-360", story: "v2-components-dialog--default", width: 360, height: 640, steps: [OPEN_DIALOG], measure: dialogMeasure() },
  { name: "06-long-form-scroll-top", story: "v2-components-dialog--scrolling-content", height: 700, steps: [LONG_OPEN, scrollTo(0)], measure: dialogMeasure() },
  { name: "07-long-form-scrolled", story: "v2-components-dialog--scrolling-content", height: 700, steps: [LONG_OPEN, scrollTo(260)], measure: dialogMeasure() },
  { name: "08-long-form-scroll-end", story: "v2-components-dialog--scrolling-content", height: 700, steps: [LONG_OPEN, scrollTo("end")], measure: dialogMeasure() },
  { name: "09-form-modal-short-viewport-top", story: "v2-components-formmodal--small", height: 380, steps: [FORM_OPEN, scrollTo(0)], measure: formMeasure() },
  { name: "10-form-modal-short-viewport-scrolled", story: "v2-components-formmodal--small", height: 380, steps: [FORM_OPEN, scrollTo(70)], measure: formMeasure() },
  { name: "11-form-modal-no-overflow", story: "v2-components-formmodal--default", height: 900, steps: [FORM_OPEN], measure: formMeasure() },
  { name: "12-confirm-default", story: "v2-components-confirmationmodal--default", height: 600, steps: [{ clickText: "Review action", after: 700 }], measure: modalMeasure() },
  { name: "13-confirm-destructive", story: "v2-components-confirmationmodal--destructive", height: 600, steps: [{ clickText: "Review action", after: 700 }], measure: modalMeasure() },
  { name: "14-confirm-close-hover", story: "v2-components-confirmationmodal--default", height: 600, steps: [{ clickText: "Review action", after: 700 }, { hover: "[role=dialog] button[aria-label=Close]" }], measure: modalMeasure() },
  { name: "15-delete-default", story: "v2-components-deleteconfirmationmodal--default", height: 600, steps: [{ clickText: "Delete webhook", after: 700 }], measure: modalMeasure() },
  { name: "16-delete-narrow-360", story: "v2-components-deleteconfirmationmodal--default", width: 360, height: 640, steps: [{ clickText: "Delete webhook", after: 700 }], measure: modalMeasure() },
  // After-only checks of the 32px hit area (the before state is a plain 24px button with no ::before).
  { name: "17-close-hit-area-dialog", story: "v2-components-dialog--default", height: 600, steps: [OPEN_DIALOG, {
    eval: "(()=>{const b=document.querySelector('[role=dialog] > button:last-child');const r=b.getBoundingClientRect();const pb=getComputedStyle(b,'::before');const probe=(dx,dy)=>{const e=document.elementFromPoint(r.left+r.width/2+dx,r.top+r.height/2+dy);return !!e&&(e===b||b.contains(e))};return JSON.stringify({visibleBox:[r.width,r.height],before:{content:pb.content,position:pb.position,width:pb.width,height:pb.height,top:pb.top,left:pb.left},hit:{inside11:probe(11,0),outside15:probe(15,0),outside17:probe(17,0),up15:probe(0,-15),up17:probe(0,-17),down15:probe(0,15),down17:probe(0,17)}})})()",
  }], measure: dialogMeasure() },
  { name: "18-close-hit-area-confirm", story: "v2-components-confirmationmodal--default", height: 600, steps: [{ clickText: "Review action", after: 700 }, {
    eval: "(()=>{const b=document.querySelector('[role=dialog] button[aria-label=Close]');const r=b.getBoundingClientRect();const pb=getComputedStyle(b,'::before');const probe=(dx,dy)=>{const e=document.elementFromPoint(r.left+r.width/2+dx,r.top+r.height/2+dy);return !!e&&(e===b||b.contains(e))};return JSON.stringify({visibleBox:[r.width,r.height],before:{content:pb.content,position:pb.position,width:pb.width,height:pb.height},hit:{inside11:probe(11,0),outside15:probe(15,0),outside17:probe(17,0),up15:probe(0,-15),up17:probe(0,-17)}})})()",
  }], measure: modalMeasure() },
];
