import * as React from "react";

/**
 * Shared scaffolding for the `Custom/Login/*` stories.
 *
 * This file is deliberately NOT a `.stories.tsx` — Storybook would treat each
 * named export as a story. It is also not listed in `components.yaml`, so the
 * CLI never copies it into a consumer's project.
 */

/**
 * The form card exactly as `AuthLayout` renders it. Kept in one place so the
 * card stories can't drift from the real screen — mirror any change here into
 * `auth-layout.tsx`.
 */
export const AUTH_CARD_CLASS =
  "flex w-full max-w-[576px] flex-col items-center gap-6 rounded-3xl border border-solid border-semantic-border-layout bg-semantic-bg-primary px-6 py-6 shadow-[1px_1px_40px_0px_rgba(160,160,160,0.1)] sm:px-12";

/** The form column's background in `AuthLayout`, so cards sit on the right tint. */
export const AUTH_PAGE_BG_CLASS = "bg-semantic-bg-subtle";

/** Centres a single form card so step stories read as components, not full pages. */
export const cardDecorator = (Story: React.ComponentType) => (
  <div
    className={`flex min-h-[560px] items-center justify-center p-8 ${AUTH_PAGE_BG_CLASS}`}
  >
    <div className={AUTH_CARD_CLASS}>
      <Story />
    </div>
  </div>
);

/**
 * Owns a field's value locally while seeding it from an arg.
 *
 * The step forms are controlled: passing an arg straight to
 * `mobileNumber`/`password`/`otp` with no change handler makes the field
 * read-only in the canvas. Holding the value in state instead keeps it
 * typeable, and the effect re-seeds it whenever the Controls panel changes.
 */
export function useSeededValue<T>(seed: T): [T, (next: T) => void] {
  const [value, setValue] = React.useState<T>(seed);
  React.useEffect(() => setValue(seed), [seed]);
  return [value, setValue];
}

/** Shared marketing copy so the shell stories match the flow stories. */
export const MARKETING = {
  marketingTitle: "Continue managing conversations efficiently",
  marketingDescription:
    "Access a unified workspace for customer engagement and support.",
};

/** Install + import preamble shared by every `Custom/Login/*` docs page. */
export const docsPreamble = (importList: string) => `
### Installation

\`\`\`bash
npx myoperator-ui add login
\`\`\`

### Import

\`\`\`tsx
import { ${importList} } from "@/components/custom/login"
\`\`\`

> Design tokens and typography for the whole flow are documented on the
> **Custom/Login/Login** page.
`;
