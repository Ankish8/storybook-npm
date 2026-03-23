import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CreateFunctionModal } from "./create-function-modal";

const meta: Meta<typeof CreateFunctionModal> = {
  title: "Custom/AI Bot/Create Function",
  component: CreateFunctionModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A **2-step wizard modal** for creating a new bot function.

---

### Step 1 — Name & Prompt
- **Functions Name** (required, max 30 chars with live counter)
- **Prompt** (required, min 100 chars, max 5000 chars with live counter)
- **Next** button — disabled until name is filled and prompt meets min length

### Step 2 — API Configuration
- **API URL** — HTTP method selector (GET / POST / PUT / DELETE / PATCH) + URL input
- **Tabs** — Header · Query parameter · Body (Body tab only visible for POST / PUT / PATCH)
  - *Header / Query parameter* — editable key-value rows with delete action; click the empty row to add a new entry
  - *Body* — textarea with 4 000 char counter (hidden for GET / DELETE)
- **Test Your API** — Gray panel ([Figma](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=40829-29141)): one row per variable with **variable name** (read-only) and **Value** side by side; empty values show **Test value is required** after **Test**; \`onTestApi\` receives optional \`apiTestVariableValues\`
- **Back** (returns to Step 1) / **Submit** (calls \`onSubmit\` and closes)

### Prop Defaults

| Prop | Default |
|------|---------|
| \`promptMinLength\` | \`100\` |
| \`promptMaxLength\` | \`5000\` |
| \`initialStep\` | \`1\` |
| \`initialTab\` | \`"header"\` |
| \`module\` | *omitted* — variable catalog **add/edit** enabled |

### Variable catalog editing — \`module\`

Pass **\`module={option.module}\`** (or **\`module={functionVariableContext.module}\`** if you use **\`FunctionVariableContextValue\`** from \`@/components/custom/ivr-bot\`) so add/edit catalog behavior matches the parent integration.

- If **\`option.module === "function"\`** → users can add/edit variables (pencils, “+ Add new variable”, edit dialog).
- If **\`module\` is any other string** → **no** catalog editing; users can still type \`{{\` to insert **existing** catalog variables only.

**Render the modal only when the integration is the function module:**

\`\`\`tsx
{option.module === "function" && (
  <CreateFunctionModal
    open={open}
    onOpenChange={setOpen}
    module={option.module}
    onSubmit={onSubmit}
  />
)}
\`\`\`

**Always render the modal, but tie variable editing to \`module\` (no need for the \`&&\` wrapper):**

\`\`\`tsx
<CreateFunctionModal
  open={open}
  onOpenChange={setOpen}
  module={option.module}
  onSubmit={onSubmit}
/>
\`\`\`

---

### Install
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

### Import
\`\`\`tsx
import { CreateFunctionModal } from "@/components/custom/ivr-bot";
\`\`\`

### Usage
\`\`\`tsx
const [open, setOpen] = React.useState(false);

<Button onClick={() => setOpen(true)}>+ Functions</Button>

<CreateFunctionModal
  open={open}
  onOpenChange={setOpen}
  onSubmit={(data) => console.log(data)}
  onTestApi={async (step2) => {
    const res = await fetch(step2.url);
    return await res.text();
  }}
/>
\`\`\`

### Design Tokens

| Token | Purpose |
|-------|---------|
| \`bg-semantic-bg-primary\` | Modal background |
| \`border-semantic-border-layout\` | Input, table, divider borders |
| \`text-semantic-text-primary\` | Field values |
| \`text-semantic-text-secondary\` | Active tab, labels |
| \`text-semantic-text-muted\` | Placeholder, helper labels |
| \`text-semantic-error-primary\` | Required asterisk |
| \`bg-semantic-bg-ui\` | Table header, response textarea |
| \`bg-semantic-primary\` | Submit button |
        `,
      },
    },
  },
  argTypes: {
    open: { control: "boolean", description: "Controls modal visibility" },
    promptMinLength: {
      control: { type: "number" },
      description: "Minimum character length for the prompt field (default: 100)",
    },
    promptMaxLength: {
      control: { type: "number" },
      description: "Maximum character length for the prompt field (default: 5000)",
    },
    initialStep: {
      control: { type: "radio" },
      options: [1, 2],
      description: "Start on Step 1 (Name/Prompt) or Step 2 (API config)",
    },
    initialTab: {
      control: { type: "radio" },
      options: ["header", "queryParams", "body"],
      description: "Active tab when initialStep = 2",
    },
    module: {
      control: { type: "text" },
      description:
        'option.module — add/edit catalog only when value is "function". See docs section “Variable catalog editing” for {option.module === "function" && (...)}.',
    },
    onOpenChange: { action: "openChange" },
    onSubmit: { action: "submit" },
    onTestApi: { action: "testApi" },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[500px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CreateFunctionModal>;

// ─── Trigger button wrapper ──────────────────────────────────────────────────
function ModalTrigger({
  label,
  initialStep,
  initialTab,
  onSubmit,
}: {
  label?: string;
  initialStep?: 1 | 2;
  initialTab?: "header" | "queryParams" | "body";
  onSubmit?: (data: unknown) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-semantic-primary text-semantic-text-inverted text-sm font-semibold rounded hover:bg-semantic-primary-hover transition-colors"
      >
        {label ?? "+ Create Function"}
      </button>
      <CreateFunctionModal
        open={open}
        onOpenChange={setOpen}
        initialStep={initialStep}
        initialTab={initialTab}
        onSubmit={onSubmit as (data: import("./types").CreateFunctionData) => void}
      />
    </>
  );
}

// ─── Step 1 — Name & Prompt ──────────────────────────────────────────────────
export const Step1NameAndPrompt: Story = {
  name: "Step 1 — Name & Prompt",
  render: () => (
    <ModalTrigger label="Open Step 1" initialStep={1} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The first step collects the **function name** (max 30 chars) and a **prompt** description. The **Next** button stays disabled until both fields have content.",
      },
    },
  },
};

// ─── Step 2 — Header Tab ─────────────────────────────────────────────────────
export const Step2HeaderTab: Story = {
  name: "Step 2 — API Config / Header",
  render: () => (
    <ModalTrigger label="Open Step 2 — Header" initialStep={2} initialTab="header" />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Step 2 with the **Header** tab active. Rows can be added by clicking the empty bottom row. Each row has editable Key / Value inputs and a delete action.",
      },
    },
  },
};

// ─── Step 2 — Query Params Tab ───────────────────────────────────────────────
export const Step2QueryParamsTab: Story = {
  name: "Step 2 — API Config / Query Parameters",
  render: () => (
    <ModalTrigger
      label="Open Step 2 — Query Params"
      initialStep={2}
      initialTab="queryParams"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Step 2 with the **Query parameter** tab active. Works identically to the Header tab — key/value pairs appended to the URL as query string parameters.",
      },
    },
  },
};

// ─── Step 2 — Body Tab ───────────────────────────────────────────────────────
export const Step2BodyTab: Story = {
  name: "Step 2 — API Config / Body",
  render: () => (
    <ModalTrigger label="Open Step 2 — Body" initialStep={2} initialTab="body" />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Step 2 with the **Body** tab active. The Body tab is only visible when the HTTP method is **POST**, **PUT**, or **PATCH**. A textarea accepts JSON, XML or any text payload. Character counter shows usage against the 4 000-char limit.",
      },
    },
  },
};

// ─── Interactive (controlled via controls panel) ─────────────────────────────
export const Interactive: Story = {
  name: "Interactive (all controls)",
  render: (args) => {
    const [open, setOpen] = React.useState(args.open ?? false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-semantic-primary text-semantic-text-inverted text-sm font-semibold rounded hover:bg-semantic-primary-hover transition-colors"
        >
          Open Modal
        </button>
        <CreateFunctionModal
          {...args}
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            args.onOpenChange?.(v);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    initialStep: 1,
    initialTab: "header",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the **Controls** panel to change `initialStep` and `initialTab` before opening the modal to preview any step/tab combination.",
      },
    },
  },
};
