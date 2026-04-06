import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CreateFunctionModal } from "./create-function-modal";
import type { CreateFunctionData, VariableGroup, VariableFormData } from "./types";

const meta: Meta<typeof CreateFunctionModal> = {
  title: "Custom/AI Bot/Create Function",
  component: CreateFunctionModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `A 2-step wizard modal for creating or editing a bot function. Step 1 collects the function name and prompt. Step 2 configures the API endpoint with headers, query parameters, and an optional request body. The body editor appears only for **POST**, **PUT**, and **PATCH**; **GET** and **DELETE** do not show a body tab.

**Install**
\`\`\`bash
npx myoperator-ui add ivr-bot
\`\`\`

**Import**
\`\`\`tsx
import { CreateFunctionModal } from "@/components/custom/ivr-bot"
\`\`\`

### Design Tokens

| Token | CSS Variable | Value | Preview |
|-------|-------------|-------|---------|
| Modal background | \`--semantic-bg-primary\` | #FFFFFF | <span style="display:inline-block;width:16px;height:16px;background:#FFFFFF;border:1px solid #E9EAEB;border-radius:3px;vertical-align:middle"></span> |
| Input / table borders | \`--semantic-border-layout\` | #E9EAEB | <span style="display:inline-block;width:16px;height:16px;background:#E9EAEB;border-radius:3px;vertical-align:middle"></span> |
| Input border | \`--semantic-border-input\` | #D5D7DA | <span style="display:inline-block;width:16px;height:16px;background:#D5D7DA;border-radius:3px;vertical-align:middle"></span> |
| Field values | \`--semantic-text-primary\` | #181D27 | <span style="display:inline-block;width:16px;height:16px;background:#181D27;border-radius:3px;vertical-align:middle"></span> |
| Tab labels | \`--semantic-text-secondary\` | #343E55 | <span style="display:inline-block;width:16px;height:16px;background:#343E55;border-radius:3px;vertical-align:middle"></span> |
| Placeholder / counters | \`--semantic-text-muted\` | #717680 | <span style="display:inline-block;width:16px;height:16px;background:#717680;border-radius:3px;vertical-align:middle"></span> |
| Required asterisk | \`--semantic-error-primary\` | #F04438 | <span style="display:inline-block;width:16px;height:16px;background:#F04438;border-radius:3px;vertical-align:middle"></span> |
| Table header / hover | \`--semantic-bg-ui\` | #F5F5F5 | <span style="display:inline-block;width:16px;height:16px;background:#F5F5F5;border:1px solid #E9EAEB;border-radius:3px;vertical-align:middle"></span> |
| Submit button | \`--semantic-primary\` | #343E55 | <span style="display:inline-block;width:16px;height:16px;background:#343E55;border-radius:3px;vertical-align:middle"></span> |`,
      },
    },
  },
  argTypes: {
    open: { control: "boolean", description: "Controls modal visibility" },
    nameMaxLength: {
      control: { type: "number" },
      description: "Maximum character length for the function name (default: 30)",
    },
    promptMinLength: {
      control: { type: "number" },
      description: "Minimum character length for the prompt field (default: 100)",
    },
    promptMaxLength: {
      control: { type: "number" },
      description: "Maximum character length for the prompt field (default: 2000)",
    },
    initialStep: {
      control: { type: "radio" },
      options: [1, 2],
      description: "Start on Step 1 (Name/Prompt) or Step 2 (API config)",
    },
    initialTab: {
      control: { type: "radio" },
      options: ["header", "queryParams", "body"],
      description:
        "Active tab when initialStep = 2. If `initialTab` is `body`, use a body-capable HTTP method in `initialData.method` (POST, PUT, or PATCH) or the UI falls back to the Header tab.",
    },
    onOpenChange: { action: "openChange" },
    onSubmit: { action: "submit" },
    onTestApi: { action: "testApi" },
    onAddVariable: { action: "addVariable" },
    onEditVariable: { action: "editVariable" },
    isEditing: {
      control: "boolean",
      description: 'When true, title shows "Edit Function"',
    },
    disabled: {
      control: "boolean",
      description: "View mode: fields disabled, Next stays enabled for navigation",
    },
    maxHeaderRows: {
      control: { type: "number" },
      description:
        "Max HTTP header rows; Add row disables at this count (default: 20)",
    },
    maxQueryParamRows: {
      control: { type: "number" },
      description:
        "Max query parameter rows; Add row disables at this count (default: 20)",
    },
    requireHeaderOrQueryPair: {
      control: "boolean",
      description:
        "When true (default), Submit requires at least one complete header or query row. False allows URL-only saves.",
    },
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
  initialData,
  variableGroups,
  onAddVariable,
  onEditVariable,
  onSubmit,
}: {
  label?: string;
  initialStep?: 1 | 2;
  initialTab?: "header" | "queryParams" | "body";
  initialData?: Partial<CreateFunctionData>;
  variableGroups?: VariableGroup[];
  onAddVariable?: (data: VariableFormData) => void;
  onEditVariable?: (originalName: string, data: VariableFormData) => void;
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
        initialData={initialData}
        variableGroups={variableGroups}
        onAddVariable={onAddVariable}
        onEditVariable={onEditVariable}
        onSubmit={onSubmit as (data: import("./types").CreateFunctionData) => void}
      />
    </>
  );
}

// ─── Sample variable groups (shared by Step 2 stories) ──────────────────────
const sampleVariableGroups: VariableGroup[] = [
  {
    label: "Function variables",
    items: [
      { name: "Order_id", editable: true, description: "The order identifier", required: true },
      { name: "customer_name", editable: true, description: "Customer's full name" },
      { name: "product_id" },
    ],
  },
];

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
          "The first step collects the **function name** (default max 30 chars, override with `nameMaxLength`) and a **prompt** description (default max 2000 chars, override with `promptMaxLength`). The **Next** button stays disabled until the name is valid and the prompt meets `promptMinLength` (default 100).",
      },
    },
  },
};

// ─── Step 2 — Header Tab ─────────────────────────────────────────────────────
export const Step2HeaderTab: Story = {
  name: "Step 2 — API Config / Header",
  render: () => (
    <ModalTrigger
      label="Open Step 2 — Header"
      initialStep={2}
      initialTab="header"
      variableGroups={sampleVariableGroups}
      onAddVariable={(data) => console.log("Add variable:", data)}
      onEditVariable={(name, data) => console.log("Edit variable:", name, data)}
    />
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
      variableGroups={sampleVariableGroups}
      onAddVariable={(data) => console.log("Add variable:", data)}
      onEditVariable={(name, data) => console.log("Edit variable:", name, data)}
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
    <ModalTrigger
      label="Open Step 2 — Body"
      initialStep={2}
      initialTab="body"
      initialData={{ method: "POST" }}
      variableGroups={sampleVariableGroups}
      onAddVariable={(data) => console.log("Add variable:", data)}
      onEditVariable={(name, data) => console.log("Edit variable:", name, data)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Step 2 with the **Body** tab active. The Body tab is shown only when the HTTP method is **POST**, **PUT**, or **PATCH** (this story uses POST). The textarea accepts JSON, XML or any text payload. Character counter shows usage against the 4 000-char body limit.",
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
    requireHeaderOrQueryPair: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the **Controls** panel to change `initialStep` and `initialTab` before opening the modal. For `initialTab: body`, set `initialData.method` to POST, PUT, or PATCH (or the Body tab is hidden and the active tab falls back to Header).",
      },
    },
  },
};

// ─── With Variable Groups ────────────────────────────────────────────────────

// Stateful wrapper that manages variable groups when variables are added/edited
function VariableGroupsDemo() {
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = React.useState<VariableGroup[]>(sampleVariableGroups);

  const handleAddVariable = (data: VariableFormData) => {
    setGroups((prev) => prev.map((g) =>
      g.label === "Function variables"
        ? { ...g, items: [...g.items, { name: data.name, description: data.description, required: data.required, editable: true }] }
        : g
    ));
  };

  const handleEditVariable = (originalName: string, data: VariableFormData) => {
    setGroups((prev) => prev.map((g) => ({
      ...g,
      items: g.items.map((item) =>
        item.name === originalName
          ? { ...item, name: data.name, description: data.description, required: data.required }
          : item
      ),
    })));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-semantic-primary text-semantic-text-inverted text-sm font-semibold rounded hover:bg-semantic-primary-hover transition-colors"
      >
        Open with Variable Groups
      </button>
      <CreateFunctionModal
        open={open}
        onOpenChange={setOpen}
        initialStep={2}
        initialTab="header"
        variableGroups={groups}
        onAddVariable={handleAddVariable}
        onEditVariable={handleEditVariable}
      />
    </>
  );
}

export const WithVariableGroups: Story = {
  name: "Step 2 — Variable Groups",
  render: () => <VariableGroupsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Step 2 with **grouped variable autocomplete**. Type `{{` in a header/query param Value field to see the popup with grouped variables, edit icons, and '+ Add new variable' button. Click '+ Add new variable' to open the create modal. Click the edit icon to open the edit modal. Variables are managed statefully in this demo.",
      },
    },
  },
};
