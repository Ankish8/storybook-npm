# Live Arc follow-up — 2026-10-07

The first all-library pass compared published documentation/source with local component code and tests. It did not establish a manual visual comparison of every rendered component. User feedback identified that the page's default resting states hid most differences.

Follow-up reference work now uses dedicated external browser tabs and actual actions. Family manifests record the observed examples: form entry/validation, selection menus, checkboxes, pickers/dropzone; dialog/drawer opening, tab/accordion/pagination navigation, menu/tooltip/toast; progress, badge confirmation, alert reconnect, avatar presence, skeleton reveal, card/empty-state actions, sorting and text shimmer.

Root directly focused Arc Input and toggled its Checkbox. Measured Input: 44px height, Inter 14px/19.6px, 1px primary border, no box shadow. Measured Checkbox role target: 44×44px with a smaller visual shell. The latter hit area remains a documented difference because expanding our invisible compact-row target could overlap adjacent controls.

Further fixes include 44px/14px field defaults; measured message-row transitions and restrained copy replacement; 36px/14px menu rows; moving pagination selection; badge width spring; contained Alert/EmptyState copy transitions; non-overlapping Skeleton Usage reveal.

The comparison page now lists updated components only, forces focus styling where focus was changed, selects changed-state examples, explains before/after behavior, and supplies Replay controls. It preserves the original frozen snapshots. No new installable components are added.

Exact Arc parity is NOT claimed. Remaining differences are explicit in family records: full word/digit morph, modal/drag drawer behavior versus our nonmodal Panel, some tab panel motion, and compact checkbox hit target. Localhost browser inspection remains blocked by tool policy, so actual local render/animation sign-off is still unverified.
