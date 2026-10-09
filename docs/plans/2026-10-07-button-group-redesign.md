# Button Group redesign

User requested a complete v2 redesign matching Arc's Button Group, including motion. It already exists in v2 and has no v1 equivalent; update the existing entry rather than introduce a duplicate.

Use one joined 8px surface with outline and solid variants, keeping MyOperator primary tokens and Button heights. A shared measured highlight travels between hovered or keyboard-focused segments using a damped spring. Dividers fade around it. Press feedback affects content only. Reserved confirmation labels crossfade without changing the segment width; unreserved labels animate width. Optional non-modal Dropdown Menu, horizontal/vertical orientation, icon-only items, responsive label collapse, disabled states, native links, and reduced-motion support complete the action pattern.

Compatibility: preserve value/defaultValue/onValueChange, value-based items, primary/default/toggle aliases, alignment and global iconOnly from the existing v2 API. They opt into selection mode, with aria-pressed; new id-based items invoke onSelect as actions and do not keep a selection. Preserve v1 source and prefix conventions.

Rejected alternatives: restyling the old selection-only pill cannot provide Arc's action semantics; adding a second ButtonGroup would duplicate the docs and installation surface.

Verification: functional keyboard, action/link, selection compatibility, disabled/menu, label feedback, resize/highlight geometry and preview synchronization tests; compiled CSS/type/lint checks; CLI and docs build. Local browser verification remains blocked by browser policy; external Arc reference was opened and its Share feedback and More actions menu exercised. No commits or publishing.
