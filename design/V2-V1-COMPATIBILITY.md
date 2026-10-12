# v1 → v2 drop-in compatibility

Date: 2026-10-04. Branch: `codex/v2-motion-polish`.

**Goal (from the user):** a developer who replaces `@/components/ui/<name>` with `@/components/ui/v2/<name>` must not break anything. Every v1 prop, export and behaviour keeps working. The only intended difference is the Bootstrap `tw-` prefix (v1 keeps it, v2 does not) and the visual redesign.

Run it: `npm run verify:v1-v2-compat` (about 90 seconds). It exits non-zero when any gate fails.

## What is checked

| # | Gate | What it proves | Tool |
|---|------|----------------|------|
| 1 | Types | For all 45 components that exist in both versions (249 v1 exports): every export exists in v2; every v1 prop, including inherited `onClick`, `aria-*` and `ref`, exists in v2; each v1 prop type is assignable to the v2 prop type (callbacks included, so a v1-typed handler is never called with a value it cannot take); nothing optional became required; static members survive. Generic types are instantiated before comparing. | `v1-v2-api-compat.mjs` (TypeScript compiler API) |
| 2 | v1 unit tests | The **unchanged v1 test suite** (1,191 assertions) is run against v2 by redirecting each `../<name>` import to `../v2/<name>`. Failures are classified as style (asserts a v1 utility class), already failing on v1, waived, or behaviour. | `v1-on-v2.mjs` + `vitest.v1-on-v2.config.ts` |
| 3 | Stories | All **430 v1 stories** are rendered once with v1 and once with v2 (imports redirected), including play functions. The DOM, console output and errors are compared. v2 may add attributes or elements; it may not lose a v1 element, attribute, role, text or explicit id. | `v1-stories-replay.test.tsx`, `v1-v2-story-diff.mjs` |
| 4 | Props | No prop declared on a v1 props interface is declared-but-never-read in v2 (a prop TypeScript accepts and the component silently ignores). 382 props scanned. | `v1-v2-dead-props.mjs` |

Each tool was mutation-tested against v2 Button (rename a prop, make a prop required, narrow a type, drop an export, drop a variant, stop reading `loadingText`): all were caught.

## Merged components

Four v1 components are folded into one v2 component, `ui/v2/modal`. The map is `design/verify/merged-components.json` and every gate reads it.

| v1 file | Exports kept in `ui/v2/modal` | How v1 code migrates |
|---------|-------------------------------|----------------------|
| `ui/dialog` | `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `dialogContentVariants`, `DialogContentProps` (the `Modal*` parts under their old names) | Change the import path. To adopt the new names, `Dialog` becomes `ModalRoot` and `DialogX` becomes `ModalX`. |
| `ui/form-modal` | `FormModal`, `FormModalProps` | Change the import path. To adopt `Modal`: fields become children, `onSave` becomes `onConfirm`, `saveButtonText` becomes `confirmButtonText`, `disableSave` becomes `confirmDisabled`, and pass `showCloseButton`. |
| `ui/confirmation-modal` | `ConfirmationModal` (the same object as `Modal`), `ConfirmationModalProps` | Change the import path, or rename to `Modal`. Same props. |
| `ui/delete-confirmation-modal` | `DeleteConfirmationModal`, `DeleteConfirmationModalProps`, with the fixed `#delete-confirmation-input` id and v1 wording | Change the import path. To adopt `Modal`: `variant="destructive"`, `requireText` instead of `confirmText`, `confirmButtonText` instead of `deleteButtonText`, and a title instead of `itemName`. |

All four become `@/components/ui/v2/modal`. The v1 behaviours are kept: Dialog shows its close button unless `hideCloseButton`, adds a hidden fallback description, and keeps its `sm`/`default`/`lg`/`xl`/`full` widths. FormModal keeps its close button, its `sm` default and its first-field focus. Only the look changes (shadcn's dialog and alert dialog), plus one deliberate behaviour change: the all-in-one `Modal` (and so `ConfirmationModal` and `DeleteConfirmationModal`) shows no close button unless `showCloseButton` is set, because Cancel and Escape already dismiss it.

The gates compare each v1 file against its owner, and a mapped file that does not exist is an error. Without the map the tools would skip these components (they look for a same-named v2 file) and v1's Dialog, FormModal and confirmation tests would pass by running against v1 itself.

## Result

| Gate | Result |
|------|--------|
| Types | 0 breaking, 1 waived, 16 informational |
| v1 tests on v2 | 1,191 assertions: 1,072 pass; 116 style-class assertions (expected); 1 already failing on v1; 2 waived; **0 behaviour failures** |
| Stories | 430/430 render with v2; 0 render errors, 0 play-function failures, 0 new console warnings, 0 lost elements/attributes/text/ids (9 waived, all PhoneInput) |
| Props | 0 of 382 declared props unread |

Two real gaps were found and fixed in v2:

1. **BouncingLoader** dropped the v1 hook classes `bouncing-loader` and `bouncing-loader__dot`. They carry no styling, but consumer CSS and tests can target them. Restored; test added.
2. **DeleteConfirmationModal** used a generated input id; v1 used the fixed id `delete-confirmation-input`. Restored (`#delete-confirmation-input` keeps working in e2e tests and stylesheets); test added.

## Intentional differences (waivers: `verify/v1-v2-compat.waivers.json`)

- **PhoneInput**: when `onCountryClick` is passed, the country area is a real `<button type="button">` named "Select country (IN +91)" instead of a clickable `<div>`. `data-testid`, `onCountryClick`, `countryFlag` and `className` are unchanged. A *disabled* v2 PhoneInput no longer fires `onCountryClick` (v1 did).
- **MultiSelect**: the chip remove crosses are pointer-only (`tabindex="-1"`, inside an `aria-hidden` group) and Clear all is a real `<button type="button">` beside the trigger instead of a `span[role=button]` inside it, so nothing is nested in the trigger button. `role="button"`, `aria-label` and click behaviour are unchanged; `getByLabelText` keeps working, but `getByRole('button', { name: 'Remove …' })` no longer finds a chip cross. Keyboard users drop the last pick with Backspace/Delete on the trigger or toggle rows in the list. Escape inside the open list now closes it (a trigger that still has focus keeps ignoring Escape unless `closeOnEscape`).
- **NumberStepField**: typing keeps a draft, so a held out-of-range number is applied (clamped) on blur or Enter instead of on every keystroke. A valid number inside `min`/`max` still calls `onValueChange` at once, and an emptied field puts the old value back on blur instead of becoming 0. The steppers are out of the Tab order (`tabindex="-1"`; the input answers the arrow and page keys), their default names follow the field's `aria-label` ("Increase Hours"), the input asks for a numeric keyboard instead of a decimal one, a stepper press from an off-grid value moves to the next grid line (as a browser's own stepper does) and the field is 50px on a coarse pointer. `disabled` at the limits, `type="number"`, `min`/`max`/`step`/`value`, the `onBlur` contract and every explicit label are unchanged.
- **useToast**: the toasts it returns can carry the new `destructive` variant (see below).

## Additive differences (nothing removed)

- `Checkbox`: new optional `error`, `invalid`, `variant="card"`, `CheckboxGroup`, and children-based parts (`Checkbox.Content` / `.Control` / `.Indicator` / `.Description` / `.Error`). A `Checkbox` without children renders exactly as before. `Radio` and `RadioGroup` have no v1 version and now live in the same file (`ui/v2/checkbox`).

- New accepted values: Avatar `variant="outline"`, Textarea `size="lg"`, Toast `variant="destructive"`. Code that uses only v1 values is unaffected. An exhaustive `Record<NonNullable<ToastProps["variant"]>, …>` written against v1 would need the extra key.
- New accessibility attributes on the same elements: `aria-invalid` (DateRangePicker, DateTimePicker, CreatableSelect, CreatableMultiSelect), `aria-busy` while Button is loading, `aria-label` on the creatable multi-select combobox.
- Alert renders an extra inner wrapper (`data-presentation="inline"`); the `role="alert"` root still receives `className`, `ref` and rest props.

## What this does not prove

- **Visuals.** v2 is a redesign. The 116 style assertions that differ are the point of v2, not a defect.
- **Behaviour no test, story or type touches.** A prop that is read but applied differently is only caught if a v1 test or story exercises it. The type gate guarantees the prop exists and accepts the same values; the props gate guarantees it is not ignored.
- **Pass-through on compound components.** A direct className/ref/`data-*` probe reached the DOM for 29 of 45 components. Accordion, Dialog, DropdownMenu, Select, Tabs, Tooltip, Table, Toast and the modal/creatable/select-field families use custom-render stories, so for those the evidence is the v1 test replay, which includes their custom-className and ref tests.
- **Real browsers.** Gates 2 and 3 run in jsdom. Layout, focus rings and animation are covered by the motion probe and Storybook review, not by these gates.
- **v1 baseline.** `date-time-picker.test.tsx > clears a value that was picked from the calendar…` fails on v1 itself today because it hard-codes September 2026 (fix on branch `fix/date-time-picker-time-bomb`).

## 2026-10-04 UI refresh: additive changes only

The 30-component refresh (see `design/figma-reports/README.md`) re-ran all four gates: COMPATIBLE 4/4, 0 breaking. New, optional, default-off API (informational findings, nothing removed):

- `Table`: `stickyHeader`; `TableHead`: `sortable` (opt-in "sortable but unsorted" glyph, pointer cursor, `aria-sort="none"`; `sortDirection={null}` alone still renders exactly like v1).
- `Skeleton`: `animation="pulse" | "shimmer" | "none"`. `EmptyState`: `size="sm"`.
- `TabsList`: `variant="pill"`. `Badge`: `dot`. New export `AvatarGroup`. `Avatar`: a failed image now falls back to initials.
- `Checkbox`, `Switch`: `description`. `Radio`: `variant="card"`.
- `DropdownMenuItem`: `destructive`.
- Behaviour that is new but additive: messages in TextField/Textarea/PhoneInput animate open; hold-to-repeat on NumberStepField; arrow/Home/End keys inside a DateTimePicker time column; `aria-current` on the matching DateRangePicker preset; `aria-sort` on sortable table headers.
- Visual only (no API): range band and preview, popover width 446px, selected-row tint, 4px option rows, neutral chip hover.
