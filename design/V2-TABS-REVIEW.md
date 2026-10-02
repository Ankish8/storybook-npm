# V2 Tabs review

Local `feat/v2` work, 2026-10-01. v1 files remain unchanged; no commits, pushes or publishing.

## Implementation

Preserved the Radix root, trigger/list/content props, controlled/uncontrolled selection, disabled tabs, orientation, direction and keyboard modes. v2 horizontal triggers use Inter14/600,16px/12px padding and a2px underline. Vertical triggers use16px/24px padding, a4px teal left border and F5F5F5 active surface. TabsCount adds an18px circle with EBECEE fill and0.4px border.

Stories cover both orientations, full/auto widths, disabled items, counts, controlled selection and manual activation. Only comparison axes are excluded. Local inbox Usage really resolves items; selection updates Controls. v1/v2 grid contains all8 orientation/layout/version combinations, with original v1 Source Sans typography.

## Actual browser checks at localhost:6008

- Overview: clicked Assigned, then changed value Control to Resolved; both selection and panel updated. Changed orientation to vertical and enabled counts. Measured16px/24px padding,4px active teal border,F5F5F5 fill; count badges18px/EBECEE.
- Manual Activation: ArrowRight focused Assigned without changing value=open; Enter changed value=assigned and its panel.
- All variants: showCounts=true,count12→18 rendered18/16/14 in both orientation samples. Gallery has contained horizontal scrolling.
- All layouts: secondDisabled Control disabled Assigned in both samples; full-width triggers distribute evenly.
- States: checked Default,Hover,Focus,Active,Disabled. Focus outline computed solid1px; disabled sample's three triggers were disabled.
- v1 vs v2: inspected8 samples/24 triggers. First pair computed Source Sans Pro and Inter respectively. All orientation/layout combinations present.
- Usage: resolved Product question; counts changed Open2→1 and Resolved1→2. Clicked Resolved; its panel retained Product question and Account setup, value Control changed to resolved. Orientation and disabled Controls affected the composed inbox.
- Docs: inspected install/import, migration and token tables; zero headings inside table cells, readable hex values and swatches. Console contained no component errors. A transient shared Storybook server-timeout notice appeared during parallel edits; rendering and interaction remained functional.

## Checks and evidence

24 focused Tabs tests passed, including vertical keyboard navigation past a disabled tab, manual activation and TabsCount native attributes. Focused ESLint, Prettier and story-inclusive TypeScript passed.

Screenshots manually read in `/Users/ankish/.codex/visualizations/2026/10/01/v2-tabs/`: overview.png,variants.png,layouts.png,states.png,comparison.png,usage.png,docs-top.png,docs-tables.png.

Metadata: Tabs source needs only its existing Radix Tabs dependency. Stories use v2 Button and original v1 Badge solely for examples/comparison.
