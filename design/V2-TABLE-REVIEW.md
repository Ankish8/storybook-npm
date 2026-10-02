# V2 Table review

Local work on `feat/v2`, 2026-10-01. Source, stories and tests remain uncommitted.

## Implementation

- Preserved every current v1 Table export and prop, including wrapping, sticky cells, skeleton loading, row highlights, avatar color overrides, controlled table toggles, refs and native attributes.
- Header: 60px, 24px horizontal padding, Inter 14px / 500 uppercase, 0.014px spacing, `#EBECEE` surface.
- Body rows: 48 / 54 / 60px minimum at sm / md / lg. Reduced vertical padding to 6 / 8 / 12px so 32px row action controls also fit the recorded heights. Wrapped content can grow rows naturally.
- Rebuilt stories around editable arguments. Example-only controls are labelled as Example, TableBody or TableRow. Overview toggles / duplicate / remove actions synchronize the live rows control. Individual sizes and states inherit the same renderer.
- Gallery axes are the only exclusions. Data, loading, wrapping and other relevant arguments apply throughout. Galleries have independent row interactions.
- Full v1/v2 comparison covers all three densities and both framed/borderless layouts. Its wide grid scrolls within the preview. v1 uses its original Source Sans font; v2 uses Inter.
- Usage has working keyboard-accessible sorting, tri-state row selection, bulk pause and live filtering synchronized with Controls.

## Actual browser review at localhost:6008

- **Docs:** inspected import/install, migration table and token table; six swatches rendered, zero heading elements inside their cells. Read screenshots for typography/wrapping/alignment.
- **Overview:** size md → sm → lg; actual rows 54 → 48 → 60px. Header always 60px; computed horizontal padding24px, font Inter14px500 uppercase, surface rgb(235,236,238). Clicked a row toggle; its checked state and expanded `rows[0].enabled` Control both changed true → false. Enabled actions, duplicated a row; body and Controls became four rows. Changed wrapping Control.
- **All variants:** checked framed/borderless cards and changed wrapping, which updated both samples.
- **All sizes:** measured rows48/54/60 and header60 in the three examples. Changed withoutBorder; all three wrappers computed border0px.
- **States:** inspected Default, forced Hover, Selected, Highlighted, Loading and Empty. Actual hover/selected rgb(245,245,245); highlight rgb(236,241,251). The final state grid uses a contained1120px minimum width.
- **v1 vs v2:** inspected all12 tables. v1 header48px (large content can grow to52.5px); v2 header60px in all densities. Font families and frames matched their intended versions. Changed loading and verified all12 bodies became three skeleton rows with12 cells.
- **Loading:** loadingRows3 → 4 rendered four body rows /20 skeleton cells; loading switch remains editable.
- **Empty state:** changed empty true → false and verified populated rows returned.
- **Usage:** selected Appointment reminders and paused it; status changed to Paused. Activated sort with Enter; aria-sort became descending. Typed Welcome; query Control became Welcome and the body filtered to one row. Changed query Control to Appointment; the field and body both updated to Appointment / the paused reminder.

During parallel story writes, the shared server briefly returned unrelated index parse errors. The server was restarted and this agent reloaded its own tab. The Table Usage review itself exposed a Storybook hook-context error; moved useArgs into the named story renderer and retested the interactions successfully.

## Local checks

- Focused Table tests: **47 passed**, including loading-to-data transitions, accessible sorting, selected-row attributes, sticky/wrapped cells, empty colSpan and controlled/disabled/keyboard table toggles.
- Focused ESLint: zero errors / warnings.
- Prettier: own files formatted.
- Story-inclusive TypeScript: passed with an isolated config including Table stories and their imports.
- Full Storybook production build / registry generation are owned by the root agent, not repeated by this subagent.

## Screenshots manually inspected

`/Users/ankish/.codex/visualizations/2026/10/01/v2-table/`

- overview.png
- docs-top.png
- docs-tables.png
- variants.png
- sizes.png
- states.png
- comparison.png
- usage.png

## Metadata

Table source depends on v2 Switch. Ensure its new registry entry includes `v2-switch`; shared metadata was not edited by this agent.
