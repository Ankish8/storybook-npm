# October 17 design feedback

Source: [v2 Design System Issues](https://docs.google.com/document/d/1NEj6y1IHHseWTx_IcSNepCp5JrUyg_Ox04FGiCd32p0), tab t.0, modified October 16.

Implement the confirmed component and documentation corrections while preserving the original v1 sources, public v1 prop/callback contracts, frozen comparisons, and the existing published route structure. Keep each component owner’s edits isolated. The source marked button dimensions for a design check. The user subsequently selected sm 32px, default 40px and large 44px; apply matching square icon sizes and keep explicit modal action/input sizing aligned.

## Requested corrections

- Secondary and outline button can barely be differentiated.
- Buttons variants labelled differently in preview and variants section
- Success state should have green filled background as is right now, for more apparent feedback.
- Too big button sizes (will check in design)
- Need ripple animation in buttons
- Odd grey background fill for buttons section against the white header background in modals
- Modals use too much padding, incompatible for general platform usecases.
- Checkbox should be center-aligned when description is added. Would look misaligned in layouts otherwise.
- Default checkbox size should be 20px.
- Not much difference between hover and disabled state in checkbox and radio cards
- Background fill for selected checkbox/radio card not appealing.
- Error state interactions for checkbox and radio are glitchy. Check here: https://jam.dev/c/21c5c8f3-5da2-45f6-afe4-f1bcb09f8f86
- No gap between search icon and placeholder/input text in search field
- There should be no hover state for readable field. Consider using white background with disabled text for readable fields.
- Date range picker fields are not responsive. Input/placeholder text does not truncate/wrap with enough gap from the clear action.
- Date range picker dropdown with no presets should span the entire field width.
- Date time picker dropdown should span the entire width, otherwise month selection layout breaks.
- Time selection buttons have outline, clashing with each other.
- Time selection dropdown section uses Source Sans Pro (not v2 font).
- Time only selection has nested dropdowns leading to double clicks. Can work with single dropdown.
- Extra top-bottom padding in time selection dropdown, adding to scroll depth.
- Date time picker with both start and end time does not reflect end time in field input.
- Date time picker dropdown layout breaks in smaller sizes.
- File uploaded status does not require any icon necessarily.
- Clear action icon button shows up outlined in preview.
- Design tokens for multiple components quote “Inter” as font family.
- Grouped dropdown options do not differentiate well in hierarchy.
- Input field label and input/placeholder text size and weight not much differentiated.
- Avatar in table not used as per native v2 design system component.
- “Page not Found” empty state illustration can be improved.
- Increment-decrement hover interactions fit odd in the number step field layout.
- OTP input gets trimmed half way
- Cursor may get missed while inputting OTP. Needs active cell border.
- Selection dropdown option in phone input field may get missed by user. Need more visible selection indicator.
- Search field differs in multi-select and select dropdown.

## Delivery

First fix component geometry, states, motion and canonical examples. Then check documentation parity, actual responsive/keyboard behavior, all v1 compatibility gates, source/CLI builds and installed registry parity. Generated registries are rebuilt only after all component owners finish. Use the current docs workflow and retain the published /design-system mount. No edits or comments are written to the source Google Doc.

## Implemented and verified

- Buttons now use distinct neutral Secondary, white Outline and transparent Ghost styles, filled accessible green Success, and a reduced-motion-aware ripple. The approved compact heights are 32 / 40 / 44px, including icon buttons and the joined SplitButton footprint.
- Checkbox/radio default is 20px with centered descriptions, distinct card states and stable validation wrappers that preserve focus and uncontrolled state.
- Search/read-only/text/number fields have corrected spacing, typography, surfaces and integrated stepper hover areas. Select and MultiSelect share search-field geometry and stronger group hierarchy; Phone keeps a persistent selected outline/check.
- DateRange truncates long labels with room for clear and stretches the no-presets calendar to its trigger. DateTime matches trigger width, uses one popup for time-only selection, removes empty wheel padding and shows end time without changing the v1 input string.
- Modal footer is white with compact padding and explicitly matching 44px input/actions. Uploaded status has no redundant success icon. OTP digits have full horizontal space, responsive gaps and a visible active border/caret. TableAvatar uses native v2 Avatar while preserving explicit custom colors. Not-found artwork is a clearer missing-page illustration.
- Active documentation now names Timeless Sans with Inter fallback and describes current styles. Original v1 source, tokens, API baseline, compatibility waivers and frozen comparisons are unchanged. CLI registries and MCP source metadata were regenerated from source.

Validation on the final component source: 201 test files, 5,884 tests passed, 5 existing skips; all four v1 compatibility gates passed (45 components, 249 exports, 430 stories, 382 props), no new waivers. Full ESLint has zero errors and five existing warnings. API, Bootstrap margins, test-presence and CVA gates pass; CVA advisories match HEAD. CLI 189 tests and its complete build/validation pipeline pass; MCP typecheck/build and library declaration build pass. Docs preview 37 tests and 10 compiled CSS/protocol checks pass; docs catalog/typechecking pass.

Native browser verification covered the approved six Button dimensions and distinct surfaces; 390px DateRange popup/trigger alignment and clear spacing; mobile OTP digits and active cell; checkbox keyboard toggles retaining focus while validation appears/disappears; grouped MultiSelect search; persistent Phone selection/filter/change; modal matching 44px controls and typed confirmation; and time-only range display.
