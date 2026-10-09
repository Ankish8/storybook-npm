> Superseded by the custom Next.js shell; see `design/V2-DOCS.md`.

# MyOperator v2 component documentation

User approved Fumadocs after reviewing custom Next.js, Fumadocs and Nextra approaches.

- Add a local Next.js/Fumadocs application under apps/docs. No publishing or changes to the product integration.
- All 56 canonical v2 components get a searchable page, examples, controls, code and existing usage/design documentation.
- Reuse existing stories as example definitions. Keep Storybook available for its testing and development tools.
- Render previews in an isolated Vite/Tailwind 3 frame. Fumadocs uses Tailwind 4; its styles and resets must not change the source components.
- Bridge example selection and controls through checked postMessage events; useArgs is backed by React state so controls and input interactions stay synchronized.
- Build the preview into the documentation application's public/preview directory for a single deployable application. Development starts both local services.
- Keep v1, v2 source, story definitions and CLI registry unchanged. No duplicate component implementation.
- Verify exhaustive catalog coverage, types and production builds, then exercise controls, navigation, source, search, overlays, responsive containment and previews in the browser.
