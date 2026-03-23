import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { VariableSelector } from "./variable-selector";
import { VariableValueInput } from "./variable-value-input";
import {
  parseValueToSegments,
  type VariableSelectorItem,
  type VariableSelectorSection,
} from "./types";
import {
  EditVariableDialog,
  type EditVariableFormValues,
} from "./edit-variable-dialog";
import { cn } from "../../../lib/utils";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

const defaultSections = [
  {
    label: "Function variables",
    variables: [
      { id: "1", name: "Order_id" },
      { id: "2", name: "customer_name" },
      { id: "3", name: "product_id", catalogEditable: false },
      { id: "4", name: "tracking_id" },
      { id: "5", name: "delivery_date" },
    ],
  },
  {
    label: "Contact fields",
    variables: [
      { id: "c1", name: "Name", catalogEditable: false },
      { id: "c2", name: "Email", catalogEditable: false },
      { id: "c3", name: "Phone number", catalogEditable: false },
    ],
  },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function cloneVariableCatalog(
  catalog: VariableSelectorSection[]
): VariableSelectorSection[] {
  return catalog.map((s) => ({
    ...s,
    variables: s.variables.map((v) => ({ ...v })),
  }));
}

function findVariableItemByName(
  sections: VariableSelectorSection[],
  name: string
): VariableSelectorItem | null {
  for (const s of sections) {
    const v = s.variables.find((x) => x.name === name);
    if (v) return v;
  }
  return null;
}

function findVariableItemById(
  sections: VariableSelectorSection[],
  id: string
): VariableSelectorItem | null {
  for (const s of sections) {
    const v = s.variables.find((x) => x.id === id);
    if (v) return v;
  }
  return null;
}

function replaceVariableTokenInText(
  text: string,
  fromName: string,
  toName: string
): string {
  if (!fromName || fromName === toName) return text;
  const escaped = fromName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}`, "g");
  return text.replace(re, `{{${toName}}}`);
}

const meta: Meta<typeof VariableSelector> = {
  title: "Custom/AI Bot/VariableSelector",
  component: VariableSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Variable selection and value input for API configuration. One install adds **VariableSelector** (popover when typing \`{{\`), **VariableValueInput** (one-line field with chips and overflow "\`...\`"), **VariableChip**, **SelectedVariablesPopover** (all variables when clicking "\`...\`"), and **EditVariableDialog** (add / edit variable — name, description, required; matches Figma).

Design: [Figma – one line / overflow](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=40753-29089), [Figma – all variables popup](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=40753-29392), [Figma – Edit variable](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=38080-173581).

### Installation
\`\`\`bash
npx myoperator-ui add variable-selector
\`\`\`

### Import
\`\`\`tsx
import {
  VariableSelector,
  VariableValueInput,
  VariableChip,
  SelectedVariablesPopover,
  EditVariableDialog,
  parseValueToSegments,
  segmentsToValue,
} from "@myoperator/ui"
import type {
  VariableSelectorItem,
  VariableSelectorSection,
  ValueSegment,
  VariableChipProps,
  VariableValueInputProps,
  EditVariableDialogProps,
  EditVariableFormValues,
} from "@myoperator/ui"
\`\`\`

### Design Tokens
| Token | Usage |
|-------|--------|
| \`bg-semantic-bg-primary\` | Popover background |
| \`border-semantic-border-layout\` | Popover border |
| \`text-semantic-text-primary\` | Variable names |
| \`text-semantic-text-muted\` | Section labels, search placeholder |
| \`text-semantic-text-secondary\` | Add new variable action |
| \`bg-semantic-bg-ui\` | Row hover/focus |
        `,
      },
    },
  },
  argTypes: {
    open: { control: "boolean", description: "Whether the popover is open" },
    searchPlaceholder: { control: "text", description: "Search input placeholder" },
    addNewLabel: { control: "text", description: "Label for Add new variable action" },
    showEditIcon: { control: "boolean", description: "Show pencil icon on each variable" },
    onOpenChange: { action: "onOpenChange" },
    onSelectVariable: { action: "onSelectVariable" },
    onAddNewVariable: { action: "onAddNewVariable" },
    onEditVariable: { action: "onEditVariable" },
    onSearchChange: { action: "onSearchChange" },
  },
};

export default meta;
type Story = StoryObj<typeof VariableSelector>;

type HeaderRow = { id: string; key: string; value: string };

function getVariableNamesFromRows(rows: HeaderRow[]): string[] {
  const names = new Set<string>();
  rows.forEach((row) => {
    parseValueToSegments(row.value).forEach((seg) => {
      if (seg.type === "variable") names.add(seg.name);
    });
  });
  return Array.from(names).sort();
}

/** Full integration: tabs, Key/Value table, Test Your API, + EditVariableDialog (add / edit catalog + chip pencil). */
function VariableSelectorIntegrationOverview() {
  /** Story uses full edit affordances; per-row pencils follow \`catalogEditable\` on each item (contact fields = no pencil). */
  const allowCatalogVariableEdit = true;

  const [activeTab, setActiveTab] = React.useState<"header" | "query" | "body">("header");
  const [rows, setRows] = React.useState<HeaderRow[]>([
    {
      id: "1",
      key: "Contact",
      value: "application/atom+xml{{contact.name}}{{contact.phone}}",
    },
    { id: "2", key: "", value: "" },
  ]);
  const [variableCatalog, setVariableCatalog] = React.useState<
    VariableSelectorSection[]
  >(() => cloneVariableCatalog(defaultSections));

  const [varCatalogDialogOpen, setVarCatalogDialogOpen] = React.useState(false);
  const [varCatalogMode, setVarCatalogMode] = React.useState<"add" | "edit">("add");
  const [varCatalogEditingId, setVarCatalogEditingId] = React.useState<string | null>(
    null
  );
  const [varCatalogOrphanName, setVarCatalogOrphanName] = React.useState<string | null>(
    null
  );
  const [varCatalogSubmitError, setVarCatalogSubmitError] = React.useState("");

  const variableNames = React.useMemo(() => getVariableNamesFromRows(rows), [rows]);
  const [testValues, setTestValues] = React.useState<Record<string, string>>({
    "contact.name": "dummy value",
    "contact.phone": "",
  });
  const [testValidationAttempted, setTestValidationAttempted] =
    React.useState(false);

  const updateRow = (id: string, updates: Partial<HeaderRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };
  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const applyRenameAcrossRows = React.useCallback((from: string, to: string) => {
    if (!from || from === to) return;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        value: replaceVariableTokenInText(r.value, from, to),
      }))
    );
  }, []);

  const openAddCatalogVariable = React.useCallback(() => {
    setVarCatalogOrphanName(null);
    setVarCatalogMode("add");
    setVarCatalogEditingId(null);
    setVarCatalogSubmitError("");
    setVarCatalogDialogOpen(true);
  }, []);

  const openEditCatalogVariable = React.useCallback((item: VariableSelectorItem) => {
    if (item.catalogEditable === false) return;
    setVarCatalogOrphanName(null);
    setVarCatalogMode("edit");
    setVarCatalogEditingId(item.id);
    setVarCatalogSubmitError("");
    setVarCatalogDialogOpen(true);
  }, []);

  const handleEditChipByName = React.useCallback(
    (name: string) => {
      const item = findVariableItemByName(variableCatalog, name);
      if (item) {
        if (item.catalogEditable === false) return;
        openEditCatalogVariable(item);
        return;
      }
      setVarCatalogOrphanName(name);
      setVarCatalogMode("edit");
      setVarCatalogEditingId(null);
      setVarCatalogSubmitError("");
      setVarCatalogDialogOpen(true);
    },
    [variableCatalog, openEditCatalogVariable]
  );

  const handleSaveCatalogVariable = React.useCallback(
    (values: EditVariableFormValues) => {
      const trimmedName = values.name.trim();
      const editingId = varCatalogEditingId;
      const orphan = varCatalogOrphanName;

      const nameTaken = variableCatalog.some((s) =>
        s.variables.some(
          (v) =>
            v.name.toLowerCase() === trimmedName.toLowerCase() && v.id !== editingId
        )
      );
      if (nameTaken) {
        setVarCatalogSubmitError("A variable with this name already exists");
        return;
      }
      setVarCatalogSubmitError("");
      const meta = {
        description: values.description.trim(),
        required: values.required,
      };

      if (varCatalogMode === "edit" && editingId) {
        const oldItem = findVariableItemById(variableCatalog, editingId);
        const oldName = oldItem?.name ?? "";
        if (oldName && oldName !== trimmedName) {
          applyRenameAcrossRows(oldName, trimmedName);
        }
        setVariableCatalog((prev) =>
          prev.map((section) => ({
            ...section,
            variables: section.variables.map((v) =>
              v.id === editingId ? { ...v, name: trimmedName, ...meta } : v
            ),
          }))
        );
      } else if (orphan) {
        if (orphan !== trimmedName) {
          applyRenameAcrossRows(orphan, trimmedName);
        }
        setVariableCatalog((prev) => {
          const next = cloneVariableCatalog(prev);
          const target =
            next.find((s) => s.label === "Function variables") ?? next[0];
          if (!target) return prev;
          target.variables.push({
            id: generateId(),
            name: trimmedName,
            ...meta,
          });
          return next;
        });
        setVarCatalogOrphanName(null);
      } else {
        setVariableCatalog((prev) => {
          const next = cloneVariableCatalog(prev);
          const target =
            next.find((s) => s.label === "Function variables") ?? next[0];
          if (!target) return prev;
          target.variables.push({
            id: generateId(),
            name: trimmedName,
            ...meta,
          });
          return next;
        });
      }
      setVarCatalogDialogOpen(false);
      setVarCatalogEditingId(null);
    },
    [
      varCatalogMode,
      varCatalogEditingId,
      varCatalogOrphanName,
      variableCatalog,
      applyRenameAcrossRows,
    ]
  );

  const catalogDialogInitialValues = React.useMemo(() => {
    if (varCatalogOrphanName) {
      return {
        name: varCatalogOrphanName,
        description: "",
        required: false,
      };
    }
    if (!varCatalogEditingId) {
      return { name: "", description: "", required: false };
    }
    const item = findVariableItemById(variableCatalog, varCatalogEditingId);
    if (!item) return { name: "", description: "", required: false };
    return {
      name: item.name,
      description: item.description ?? "",
      required: item.required ?? false,
    };
  }, [variableCatalog, varCatalogEditingId, varCatalogOrphanName]);

  return (
    <>
    <div className="w-full max-w-[696px] rounded border border-semantic-border-layout bg-semantic-bg-primary p-0">
      {/* Tabs */}
      <div className="flex border-b border-semantic-border-layout">
        {(
          [
            { id: "header" as const, label: "Header(0)" },
            { id: "query" as const, label: "Query parameter(0)" },
            { id: "body" as const, label: "Body" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={
              activeTab === id
                ? "border-b-2 border-semantic-primary px-2.5 py-2 text-sm font-semibold text-semantic-text-primary"
                : "border-b-2 border-transparent px-2.5 py-2 text-sm font-semibold text-semantic-text-muted hover:text-semantic-text-secondary"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-0">
        <p className="m-0 mb-1 pt-4 text-xs text-semantic-text-muted">Header</p>
        <div className="overflow-hidden rounded border border-semantic-border-input">
          <div className="flex border-b border-semantic-border-input bg-semantic-bg-primary">
            <div className="flex h-10 w-[232px] shrink-0 items-center border-r border-semantic-border-input px-3 py-2.5 text-sm font-semibold text-semantic-text-muted">
              Key
            </div>
            <div className="flex min-w-0 flex-1 items-center border-r border-semantic-border-input px-3 py-2.5 text-sm font-semibold text-semantic-text-muted">
              Value
            </div>
            <div className="w-[38px] shrink-0" />
          </div>
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex border-b border-semantic-border-input last:border-b-0"
            >
              <div className="w-[232px] shrink-0 border-r border-semantic-border-input">
                <Input
                  value={row.key}
                  onChange={(e) => updateRow(row.id, { key: e.target.value })}
                  placeholder="Key"
                  className="h-10 rounded-none border-0 border-r-0 focus-visible:ring-0"
                />
              </div>
              <div className="min-w-0 flex-1 border-r border-semantic-border-input">
                <VariableValueInput
                  value={row.value}
                  onChange={(v) => updateRow(row.id, { value: v })}
                  placeholder="Type {{ to add variables"
                  variableSections={variableCatalog}
                  maxVisibleChips={1}
                  showEditIcon={allowCatalogVariableEdit}
                  onAddNewVariable={
                    allowCatalogVariableEdit ? openAddCatalogVariable : undefined
                  }
                  onEditVariable={
                    allowCatalogVariableEdit ? openEditCatalogVariable : undefined
                  }
                  onEditVariableChip={
                    allowCatalogVariableEdit ? handleEditChipByName : undefined
                  }
                  className="h-10 rounded-none border-0 border-l-0 focus-within:ring-0 focus-within:ring-offset-0"
                />
              </div>
              <div className="flex w-[38px] shrink-0 items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete row"
                  onClick={() => deleteRow(row.id)}
                  className="text-semantic-text-muted hover:text-semantic-error-primary"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-semantic-border-layout pt-4">
        <p className="m-0 mb-2 text-xs font-semibold text-semantic-text-muted tracking-[0.048px]">
          Test Your API
        </p>
        <div
          className={cn(
            "rounded border border-semantic-border-layout bg-semantic-bg-ui p-3",
            "flex flex-col gap-3"
          )}
        >
          {variableNames.length === 0 ? (
            <p className="m-0 text-sm text-semantic-text-muted">
              Add variables in the Value field (type{" "}
              <code className="rounded bg-semantic-bg-primary px-1 py-0.5 text-xs">
                {`{{`}
              </code>
              ) to see test inputs here.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {variableNames.map((name) => {
                const showError =
                  testValidationAttempted && !testValues[name]?.trim();
                return (
                  <div
                    key={name}
                    className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3.5"
                  >
                    <input
                      type="text"
                      readOnly
                      tabIndex={-1}
                      value={name}
                      aria-label={`Variable ${name}`}
                      className="m-0 h-10 min-h-10 min-w-0 flex-1 cursor-default rounded border border-semantic-border-layout bg-semantic-bg-primary px-3 text-sm text-semantic-text-primary outline-none"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <Input
                        value={testValues[name] ?? ""}
                        onChange={(e) =>
                          setTestValues((prev) => ({
                            ...prev,
                            [name]: e.target.value,
                          }))
                        }
                        placeholder="Value"
                        state={showError ? "error" : "default"}
                        aria-label={`Test value for ${name}`}
                        aria-invalid={showError}
                        className="h-10 min-h-10 text-sm"
                      />
                      {showError && (
                        <p className="m-0 flex items-center gap-2 text-xs text-semantic-error-primary">
                          <AlertCircle className="size-3 shrink-0" aria-hidden />
                          Test value is required
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-10 min-w-[80px] px-6 text-xs font-semibold"
              onClick={() => {
                setTestValidationAttempted(true);
                const invalid = variableNames.some(
                  (n) => !testValues[n]?.trim()
                );
                if (!invalid) setTestValidationAttempted(false);
              }}
            >
              Test
            </Button>
          </div>
        </div>
      </div>
    </div>

    {allowCatalogVariableEdit ? (
      <EditVariableDialog
        open={varCatalogDialogOpen}
        onOpenChange={(next) => {
          setVarCatalogDialogOpen(next);
          if (!next) {
            setVarCatalogSubmitError("");
            setVarCatalogEditingId(null);
            setVarCatalogOrphanName(null);
          }
        }}
        mode={varCatalogMode}
        initialValues={catalogDialogInitialValues}
        onSave={handleSaveCatalogVariable}
        submitError={varCatalogSubmitError}
        onClearSubmitError={() => setVarCatalogSubmitError("")}
      />
    ) : null}
    </>
  );
}

function VariableSelectorWithInputTrigger(props: Partial<Story["args"]>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (value.includes("{{")) setOpen(true);
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <Input
        ref={inputRef}
        placeholder="Type {{ to add variables"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-[428px]"
      />
      <VariableSelector
        open={open}
        onOpenChange={setOpen}
        anchorRef={inputRef}
        sections={defaultSections}
        onSelectVariable={(item) => {
          setValue((v) => v.replace(/\{\{?$/, `{{${item.name}}}`));
          setOpen(false);
        }}
        onAddNewVariable={() => {}}
        onEditVariable={() => {}}
        {...props}
      />
    </div>
  );
}

export const Overview: Story = {
  name: "Overview — full integration",
  render: () => <VariableSelectorIntegrationOverview />,
  parameters: {
    docs: {
      description: {
        story: `
**Full integration** matching the design screenshots and **Create Function** (step 2) behavior:

0. **Variable popover (Figma)** — [Create Function expanded picker](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM?node-id=40753-29023): **Search** (38px row), **+ Add new variable**, then section labels (**Function variables**, **Contact fields**) and rows. Per-row **pencil** follows \`catalogEditable\` (e.g. \`product_id\` and built-in contact fields omit it). When \`module !== "function"\`, omit \`onEditVariable\` / \`onAddNewVariable\` to hide all edit UI.
1. **Tabs** — Header(0) (active), Query parameter(0), Body.
2. **Header table** — Key | Value | Action (trash). Row 1: Key "Contact", Value with chips; pencils only on catalog-editable variables. Row 2: placeholder row. Delete row via trash icon.
3. **VariableSelector** — Default layout is sectioned like Figma; optional \`flatList\` merges sections for custom UIs.
4. **EditVariableDialog** — **+ Add new variable** / pencils on editable rows open the dialog.
5. **SelectedVariablesPopover** — Click \`...\` → chips respect \`catalogEditable\` per name.
6. **Test Your API** — Variables from all row values; **Test** validates required test values.

**Production:** **CreateFunctionModal** uses \`module\` and \`catalogEditable\` on catalog items (see default \`product_id\` / contact fields).
        `,
      },
    },
  },
};

export const Default: Story = {
  name: "Default (triggered by typing {{)",
  render: () => <VariableSelectorWithInputTrigger />,
  parameters: {
    docs: {
      description: {
        story: "Type `{{` in the input to open the variable popover. Select a variable to insert it.",
      },
    },
  },
};

export const OpenWithAnchor: Story = {
  name: "Open (standalone)",
  render: function OpenWithAnchorRender() {
    const anchorRef = React.useRef<HTMLDivElement>(null);
    return (
      <div className="flex flex-col gap-2">
        <div
          ref={anchorRef}
          className="h-10 w-[428px] rounded border border-semantic-border-input px-3 py-2 text-sm text-semantic-text-primary"
        >
          {`{{`}
        </div>
        <VariableSelector
          open={true}
          onOpenChange={() => {}}
          anchorRef={anchorRef}
          sections={defaultSections}
          onSelectVariable={() => {}}
          onAddNewVariable={() => {}}
          onEditVariable={() => {}}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Popover open and anchored below a fake value field showing `{{`.",
      },
    },
  },
};

export const WithSearchAndAddNew: Story = {
  name: "With search and Add new variable",
  render: () => (
    <VariableSelectorWithInputTrigger
      searchPlaceholder="Search"
      addNewLabel="+ Add new variable"
      onAddNewVariable={() => {}}
    />
  ),
};

export const SingleSection: Story = {
  name: "Single section",
  render: function SingleSectionRender() {
    const anchorRef = React.useRef<HTMLDivElement>(null);
    return (
      <div className="flex flex-col gap-2">
        <div ref={anchorRef} className="h-10 w-64 rounded border border-semantic-border-input px-3 py-2 text-sm">
          {`{{`}
        </div>
        <VariableSelector
          open={true}
          onOpenChange={() => {}}
          anchorRef={anchorRef}
          sections={[{ label: "Function variables", variables: defaultSections[0].variables }]}
        />
      </div>
    );
  },
};
