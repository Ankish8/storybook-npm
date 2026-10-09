# Isolated v2 story previews

This Vite iframe imports the **existing v2 CSF story modules unchanged**. Its React, Tailwind 3 compiler, component CSS, Bootstrap comparison styles and story helpers come from the repository root. Fumadocs/Next may use Tailwind 4 independently; its reset never enters this iframe.

## Run

From the repository root:

```bash
node apps/docs/scripts/generate-preview.mjs --dev # 127.0.0.1:6011/preview/
node apps/docs/scripts/generate-preview.mjs       # apps/docs/public/preview
```

The coordinated `npm run docs` starts this preview and Next on 6009. The production documentation build generates these preview assets before building Next.

A preview URL is:

```text
http://localhost:6011/preview/?component=input&story=Overview&parentOrigin=http%3A%2F%2Flocalhost%3A6009
```

In production, use the same-origin `/preview/` URL and pass the documentation origin. Only the exact current origin or localhost/127.0.0.1:6009 development origins can be the parent. Both `event.origin` and `event.source === window.parent` are checked. Unknown story/component selections and stale component/story arg patches are rejected.

## Message contract

Every message includes `channel: "myoperator-v2-docs"`.

Parent → preview:

- `{type: "select-story", component?: "input", story: "Overview"}`. IDs are exact CSF export names, not display labels.
- `{type: "update-args", component?: "input", story?: "Overview", args: {value: "Edited"}}`. Only currently exposed Controls can be edited; callbacks stay private.
- `{type: "reset", component?: "input", story?: "Overview"}`. Restores merged meta/story args.
- `{type: "request-metadata"}`. Replays current metadata if the parent missed the initial handshake.

Preview → parent:

- `ready`: `component`, `story`.
- `metadata`: `component`, `title`, `story`, `stories: [{id,name,description,hasPlay}]`, current JSON-safe `args`, filtered `argTypes`, component `description`, `docs: {description,storyDescription,interactionRunner:false}`, `layout`.
- `args-updated`: `component`, `story`, JSON-safe `args` and current filtered `argTypes`. The parent should update both so conditional Controls remain accurate.
- `resize`: bounded `height` (180–1800px; open dialog/calendar previews fit their measured panel plus 80px of breathing room (minimum 320px), full-height panels reserve 480px, and open menus reserve 480px).
- `error`: plain `message`.
- `action`: `component`, `story`, mock `name` and JSON-safe callback `args`.

React elements, functions, cyclic references and non-JSON objects never cross the message boundary. Icon mappings are applied inside the iframe; Controls retain the original booleans/enums. Nested parameters/argTypes, meta+story decorators, story defaults and Controls include/exclude/disable/conditional rules are preserved. The decorator child identity remains stable while args change, so typing keeps focus and local state. Stories remount when the selected component/story changes.

## Rendering boundaries

- `storybook/preview-api` resolves to a local React-context `useArgs` adapter. Typing/toggling updates the same args sent to Controls; parent edits render back into the story.
- `storybook/test` supplies rendering-time named callback spies. **Play functions and beforeEach are never run.** Test-only APIs throw if invoked. This preview is not a Storybook interaction runner and cannot establish that play tests pass.
- Existing `pseudo-hover`, `pseudo-active` and focus gallery classes are supported by a preview-only PostCSS selector transform. Real pointer/focus selectors remain active, and disabled selector restrictions remain intact.
- `centered`, `padded` and `fullscreen` layouts stay distinct. Resize is measured from content rather than iframe viewport height, preventing resize feedback. Dialogs/toasts stay inside the iframe; keyboard and Escape must target the iframe.
- Inter 400/500/600/700 is served locally from the docs package. The legacy Source Sans Pro comparison font uses the same Google Fonts definition as Storybook.

## Focused checks

```bash
node --test apps/docs/preview/src/model.test.mjs
node node_modules/vitest/vitest.mjs run --config apps/docs/preview/vitest.config.mjs
node node_modules/typescript/bin/tsc -p apps/docs/preview/tsconfig.json --noEmit
```

These check metadata composition, safe origins/JSON/patches, every catalogued module and all of their story registrations, and synchronized typing/Controls without field remounts. Browser review still establishes actual visuals, portal geometry and live interactions. No canonical components, stories or root dependencies are rewritten by this runtime.
