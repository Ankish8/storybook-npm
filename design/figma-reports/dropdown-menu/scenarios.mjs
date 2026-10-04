// DropdownMenu: row radius, keyboard ring, check pop (checkbox/radio), destructive item, group label (unchanged by decision).
const MENU = ["border-radius", "padding", "box-shadow", "transform-origin"];
const ROW = ["background-color", "color", "border-radius", "box-shadow", "min-height", "padding-left", "padding-right", "padding-top", "font-weight", "font-size"];
const CHECK = ["opacity", "color", "animation-name", "animation-duration", "animation-timing-function"];
const LABEL = ["font-size", "font-weight", "color", "padding-left", "padding-top"];
const measure = {
  Menu: { sel: "[role=menu]", props: MENU },
  "Group label": { sel: "[role=menu] > div:first-child", props: LABEL },
  "Row (first)": { sel: "[role=menuitem]", props: ROW },
  "Row (highlighted)": { sel: "[role=menuitem][data-highlighted], [role=menuitemcheckbox][data-highlighted], [role=menuitemradio][data-highlighted]", props: ROW },
  "Row (destructive)": { sel: "[role=menuitem].text-semantic-error-text", props: ROW },
  "Row (checkbox)": { sel: "[role=menuitemcheckbox]", props: ROW },
  "Check icon (checkbox)": { sel: "[role=menuitemcheckbox][data-state=checked] svg", props: CHECK },
  "Row (radio, checked)": { sel: "[role=menuitemradio][data-state=checked]", props: ROW },
  "Check icon (radio)": { sel: "[role=menuitemradio][data-state=checked] svg", props: CHECK },
};
const T = "button[aria-haspopup=menu]";
const open = [{ click: T }];
export default [
  { name: "01-closed", story: "v2-components-dropdown-menu--overview", measure },
  { name: "02-open", story: "v2-components-dropdown-menu--overview", steps: open, measure },
  { name: "03-hover-row", story: "v2-components-dropdown-menu--overview", steps: [...open, { hoverText: "Duplicate", within: "[role=menu]" }], measure },
  { name: "04-keyboard-row", story: "v2-components-dropdown-menu--overview", steps: [{ key: "Tab" }, { key: "ArrowDown" }, { key: "ArrowDown" }], measure },
  { name: "05-keyboard-open-then-hover", story: "v2-components-dropdown-menu--overview", steps: [{ key: "Tab" }, { key: "ArrowDown" }, { hoverText: "Archive", within: "[role=menu]" }], measure },
  { name: "06-destructive-hover", story: "v2-components-dropdown-menu--overview", steps: [...open, { hoverText: "Archive", within: "[role=menu]" }], measure },
  { name: "07-destructive-story", story: "v2-components-dropdown-menu--destructive", steps: open, measure },
  { name: "08-destructive-keyboard", story: "v2-components-dropdown-menu--destructive", steps: [{ key: "Tab" }, { key: "ArrowDown" }], measure },
  { name: "09-disabled-items", story: "v2-components-dropdown-menu--disabled-items", steps: open, measure },
  { name: "10-checkbox-checked", story: "v2-components-dropdown-menu--checkboxes", steps: [...open, { clickText: "Desktop notifications", within: "[role=menu]" }], measure },
  { name: "11-radio", story: "v2-components-dropdown-menu--radio-groups", steps: open, measure },
  { name: "12-submenu", story: "v2-components-dropdown-menu--submenus", steps: [...open, { hoverText: "Share conversation", within: "[role=menu]" }, { wait: 300 }], measure },
  { name: "13-description-suffix", story: "v2-components-dropdown-menu--with-description-and-suffix", steps: [...open, { hoverText: "Edit conversation", within: "[role=menu]" }], measure },
  { name: "14-narrow", story: "v2-components-dropdown-menu--with-description-and-suffix", width: 340, height: 600, steps: open, measure },
];
