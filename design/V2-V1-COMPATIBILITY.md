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
- **useToast**: the toasts it returns can carry the new `destructive` variant (see below).

## Additive differences (nothing removed)

- New accepted values: Avatar `variant="outline"`, Textarea `size="lg"`, Toast `variant="destructive"`. Code that uses only v1 values is unaffected. An exhaustive `Record<NonNullable<ToastProps["variant"]>, …>` written against v1 would need the extra key.
- New accessibility attributes on the same elements: `aria-invalid` (DateRangePicker, DateTimePicker, CreatableSelect, CreatableMultiSelect), `aria-busy` while Button is loading, `aria-label` on the creatable multi-select combobox.
- Alert renders an extra inner wrapper (`data-presentation="inline"`); the `role="alert"` root still receives `className`, `ref` and rest props.

## What this does not prove

- **Visuals.** v2 is a redesign. The 116 style assertions that differ are the point of v2, not a defect.
- **Behaviour no test, story or type touches.** A prop that is read but applied differently is only caught if a v1 test or story exercises it. The type gate guarantees the prop exists and accepts the same values; the props gate guarantees it is not ignored.
- **Pass-through on compound components.** A direct className/ref/`data-*` probe reached the DOM for 29 of 45 components. Accordion, Dialog, DropdownMenu, Select, Tabs, Tooltip, Table, Toast and the modal/creatable/select-field families use custom-render stories, so for those the evidence is the v1 test replay, which includes their custom-className and ref tests.
- **Real browsers.** Gates 2 and 3 run in jsdom. Layout, focus rings and animation are covered by the motion probe and Storybook review, not by these gates.
- **v1 baseline.** `date-time-picker.test.tsx > clears a value that was picked from the calendar…` fails on v1 itself today because it hard-codes September 2026 (fix on branch `fix/date-time-picker-time-bomb`).
