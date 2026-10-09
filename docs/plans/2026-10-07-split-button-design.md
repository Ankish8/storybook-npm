# Split Button

Approved user direction: add Arc Split Button as a new v2 component. Preserve MyOperator primary color, 8px corners and existing v1/v2 components.

Compose v2 Button and Dropdown Menu, sharing label/icon feedback and menu focus/portal behavior. A standalone reimplementation would duplicate these contracts; modifying ButtonGroup would change its selection semantics. Use two native buttons: main action and a stable chevron anchor. Primary/secondary styles plus default/outline compatibility aliases; text sizes sm/default/lg. Optional leading icon, disabled/loading state, per-action icons/disabled/destructive flags, and controlled or uncontrolled menu visibility. Empty action arrays render a normal button. Main defaults to type=button; attributes/ref belong to the main button. Menu choices run their own callback without implicitly changing the default action.

Use Button's existing label/width animation, a restrained chevron rotation, and staggered menu item content fades. No scaling on the dropdown anchor. Reduced motion uses opacity only. Right-aligned collision-aware portal. Close and block the menu whenever the control becomes disabled or busy. Announce changed labels politely.

Add working Controls, live selection feedback, variants/sizes/states/Usage/keyboard stories; register in docs and CLI with v2-button/v2-dropdown-menu dependencies. Verify native form semantics, independent action callbacks, keyboard navigation/focus return, disabled/loading, controlled menus, empty items, long labels and installation. Browser access to localhost remains restricted; do not work around it or claim local visual verification. Keep all changes local.
