import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import * as V2 from "./table";
import * as V1 from "../table";
import { Badge } from "./badge";
import { Badge as BadgeV1 } from "../badge";
import { TagGroup } from "./tag";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

interface Campaign {
  id: number;
  name: string;
  owner: string;
  contacts: number;
  enabled: boolean;
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: "Welcome messages",
    owner: "AK",
    contacts: 1240,
    enabled: true,
  },
  {
    id: 2,
    name: "Quarterly follow-up for customers waiting for a product update",
    owner: "SP",
    contacts: 680,
    enabled: false,
  },
  {
    id: 3,
    name: "Appointment reminders",
    owner: "JD",
    contacts: 920,
    enabled: true,
  },
];

type ExampleArgs = V2.TableProps & {
  /** TableBody argument, kept separate from the shipped Table API. */
  isLoading: boolean;
  loadingRows: number;
  /** TableRow argument used by the example. */
  highlighted: boolean;
  rows: Campaign[];
  empty: boolean;
  showToggle: boolean;
  showActions: boolean;
  disabled: boolean;
  query: string;
  onEnabledChange: (id: number, enabled: boolean) => void;
  onRowAction: (id: number, action: string) => void;
};

function TableExample({
  args,
  version = "v2",
  onRowsChange,
  rowState,
  sticky = false,
}: {
  args: ExampleArgs;
  version?: "v1" | "v2";
  onRowsChange?: (rows: Campaign[]) => void;
  rowState?: "hover" | "selected";
  sticky?: boolean;
}) {
  const UI = version === "v1" ? V1 : V2;
  const Status = version === "v1" ? BadgeV1 : Badge;
  const [localRows, setLocalRows] = React.useState(args.rows);
  const [notice, setNotice] = React.useState("");
  // A gallery's Controls seed every sample while row interactions stay independent.
  const seed = JSON.stringify(args.rows);
  const [previousSeed, setPreviousSeed] = React.useState(seed);
  if (previousSeed !== seed) {
    setPreviousSeed(seed);
    setLocalRows(args.rows);
  }
  const data = onRowsChange ? args.rows : localRows;
  const updateRows = (rows: Campaign[]) => {
    if (onRowsChange) onRowsChange(rows);
    else setLocalRows(rows);
  };
  const columns = 4 + Number(args.showToggle) + Number(args.showActions);
  return (
    <div
      className={
        version === "v1" ? "min-w-0 max-w-full font-sans" : "min-w-0 max-w-full"
      }
    >
      <UI.Table
        size={args.size}
        withoutBorder={args.withoutBorder}
        wrapContent={args.wrapContent}
        className={args.className}
        aria-label={version + " campaigns"}
        aria-busy={args.isLoading || undefined}
      >
        <UI.TableHeader>
          <UI.TableRow>
            <UI.TableHead scope="col" sticky={sticky}>
              Campaign
            </UI.TableHead>
            <UI.TableHead scope="col">Owner</UI.TableHead>
            <UI.TableHead scope="col">Status</UI.TableHead>
            <UI.TableHead
              scope="col"
              infoTooltip="Contacts included in this campaign"
            >
              Contacts
            </UI.TableHead>
            {args.showToggle && (
              <UI.TableHead scope="col">Enabled</UI.TableHead>
            )}
            {args.showActions && (
              <UI.TableHead scope="col">Actions</UI.TableHead>
            )}
          </UI.TableRow>
        </UI.TableHeader>
        <UI.TableBody
          isLoading={args.isLoading}
          loadingRows={args.loadingRows}
          loadingColumns={columns}
        >
          {args.empty || data.length === 0 ? (
            <UI.TableEmpty colSpan={columns}>
              No campaigns yet. Create a campaign to see it here.
            </UI.TableEmpty>
          ) : (
            data.map((row) => (
              <UI.TableRow
                key={row.id}
                highlighted={args.highlighted}
                className={rowState === "hover" ? "pseudo-hover" : undefined}
                data-state={rowState === "selected" ? "selected" : undefined}
              >
                <UI.TableCell sticky={sticky} className="font-medium">
                  {row.name}
                </UI.TableCell>
                <UI.TableCell>
                  <UI.TableAvatar initials={row.owner} />
                </UI.TableCell>
                <UI.TableCell>
                  <Status variant={row.enabled ? "active" : "disabled"}>
                    {row.enabled ? "Active" : "Paused"}
                  </Status>
                </UI.TableCell>
                <UI.TableCell>
                  {row.contacts.toLocaleString("en-US")}
                </UI.TableCell>
                {args.showToggle && (
                  <UI.TableCell>
                    <UI.TableToggle
                      checked={row.enabled}
                      disabled={args.disabled}
                      aria-label={"Enable " + row.name}
                      onCheckedChange={(enabled) => {
                        args.onEnabledChange(row.id, enabled);
                        updateRows(
                          data.map((item) =>
                            item.id === row.id ? { ...item, enabled } : item
                          )
                        );
                      }}
                    />
                  </UI.TableCell>
                )}
                {args.showActions && (
                  <UI.TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={args.disabled}
                          aria-label={"Actions for " + row.name}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            args.onRowAction(row.id, "duplicate");
                            updateRows([
                              ...data,
                              {
                                ...row,
                                id:
                                  Math.max(0, ...data.map((item) => item.id)) +
                                  1,
                                name: row.name + " (copy)",
                              },
                            ]);
                            setNotice("Duplicated " + row.name);
                          }}
                        >
                          <Copy />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-semantic-error-text focus:text-semantic-error-text"
                          onSelect={() => {
                            args.onRowAction(row.id, "remove");
                            updateRows(
                              data.filter((item) => item.id !== row.id)
                            );
                            setNotice(
                              "Removed " + row.name + " from this example"
                            );
                          }}
                        >
                          <Trash2 />
                          Remove from example
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </UI.TableCell>
                )}
              </UI.TableRow>
            ))
          )}
        </UI.TableBody>
      </UI.Table>
      {notice && (
        <p className="m-0 mt-3 text-xs text-semantic-text-muted" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}

const meta: Meta<ExampleArgs> = {
  title: "V2/Components/Table",
  component: V2.Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: [
        "size",
        "withoutBorder",
        "wrapContent",
        "className",
        "isLoading",
        "loadingRows",
        "highlighted",
        "empty",
        "rows",
        "showToggle",
        "showActions",
        "disabled",
        "query",
        "onEnabledChange",
        "onRowAction",
      ],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-8961",
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "table",
          exportName:
            "Table, TableHeader, TableBody, TableRow, TableHead, TableCell",
          summary:
            "Composed tables with row density, loading and empty states, sticky columns and row controls.",
          changes: [
            [
              "Header",
              "48px, semibold inherited font",
              "60px, uppercase Inter 14px / 500",
            ],
            [
              "Body density",
              "Padding-based density",
              "Small 48px · medium 54px · large 60px minimum row heights",
            ],
            ["Cell padding", "16px horizontally", "24px horizontally"],
            ["Surface", "Neutral header", "Primary surface #EBECEE"],
            [
              "Table behavior",
              "Composed markup, loading, wrapping and sticky cells",
              "Same exports, props and behavior",
            ],
          ],
          tokens: [
            ["Header", "--semantic-primary-surface", "#EBECEE", "#EBECEE"],
            ["Text", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Header text", "--semantic-text-secondary", "#535862", "#535862"],
            ["Divider", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Highlight", "--semantic-info-surface", "#ECF1FB", "#ECF1FB"],
            ["Hover / selected", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Font", "--font-v2", "Inter"],
          ],
          guidance:
            "Table controls density, the outer border and wrapping. TableBody owns loading; TableRow owns highlights. The Example controls below configure a composed table, not extra Table props. Use scope on column headers, aria-sort on sortable headers and labelled row controls. A dense table may scroll horizontally inside its own frame. wrapContent permits taller rows when text needs more space.",
        }),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full min-w-0 max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  args: {
    size: "md",
    withoutBorder: false,
    wrapContent: false,
    className: "",
    isLoading: false,
    loadingRows: 3,
    highlighted: false,
    empty: false,
    rows: CAMPAIGNS,
    showToggle: true,
    showActions: false,
    disabled: false,
    query: "",
    onEnabledChange: fn(),
    onRowAction: fn(),
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Body-row density; the header stays 60px high.",
      table: { defaultValue: { summary: "md" } },
    },
    withoutBorder: {
      control: "boolean",
      description: "Remove the rounded outer frame.",
    },
    wrapContent: {
      control: "boolean",
      description:
        "Allow longer cell content to wrap; otherwise the table scrolls horizontally.",
    },
    className: {
      control: "text",
      description: "Additional classes on the table element.",
    },
    isLoading: {
      control: "boolean",
      table: { category: "TableBody" },
      description: "Show skeleton rows instead of data.",
    },
    loadingRows: {
      control: { type: "number", min: 1, max: 10 },
      table: { category: "TableBody" },
    },
    highlighted: {
      control: "boolean",
      table: { category: "TableRow" },
      description: "Highlight every sample row.",
    },
    rows: {
      control: "object",
      table: { category: "Example" },
      description:
        "Live example data. Overview row toggles and actions update this control.",
    },
    empty: {
      control: "boolean",
      table: { category: "Example" },
      description: "Show the composed table's empty message.",
    },
    showToggle: {
      control: "boolean",
      table: { category: "Example" },
      description: "Include the independently controlled enabled switches.",
    },
    showActions: {
      control: "boolean",
      table: { category: "Example" },
      description: "Include working duplicate / remove menus.",
    },
    disabled: {
      control: "boolean",
      table: { category: "Example" },
      description: "Disable row controls and usage actions.",
    },
    query: {
      control: "text",
      table: { category: "Example" },
      description: "Live campaign filter in Usage.",
    },
    onEnabledChange: { control: false, table: { category: "Example" } },
    onRowAction: { control: false, table: { category: "Example" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ExampleArgs>();
    return (
      <TableExample args={args} onRowsChange={(rows) => updateArgs({ rows })} />
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const PLAYGROUND = gallery(
  ["query"],
  "Edit the table and composed-example controls. Row switches and menus update the live rows argument."
);
export const Overview: Story = { parameters: PLAYGROUND };
export const Small: Story = { args: { size: "sm" }, parameters: PLAYGROUND };
export const Medium: Story = { args: { size: "md" }, parameters: PLAYGROUND };
export const Large: Story = { args: { size: "lg" }, parameters: PLAYGROUND };
export const Borderless: Story = {
  args: { withoutBorder: true },
  parameters: PLAYGROUND,
};
export const Loading: Story = {
  args: { isLoading: true },
  parameters: PLAYGROUND,
};
export const EmptyState: Story = {
  args: { empty: true },
  parameters: PLAYGROUND,
};
export const HighlightedRow: Story = {
  args: { highlighted: true },
  parameters: PLAYGROUND,
};
export const Wrapped: Story = {
  args: { wrapContent: true },
  parameters: PLAYGROUND,
};

function ExampleCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 max-w-full rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
        {title}
      </h3>
      <p className="m-0 mt-1 mb-4 text-xs text-semantic-text-muted">
        {description}
      </p>
      {children}
    </section>
  );
}

export const AllVariants: Story = {
  name: "All variants",
  parameters: gallery(
    ["withoutBorder", "query"],
    "The frame is fixed for each sample. Density, wrapping, data, loading and row-control arguments apply to both; switches stay independent."
  ),
  render: (args) => (
    <div className="grid max-w-full grid-cols-1 gap-5 md:grid-cols-2">
      {[false, true].map((withoutBorder) => (
        <ExampleCard
          key={String(withoutBorder)}
          title={withoutBorder ? "Borderless" : "Framed"}
          description={
            withoutBorder
              ? "A table embedded in an existing surface."
              : "8px corners and a subtle outline."
          }
        >
          <TableExample args={{ ...args, withoutBorder }} />
        </ExampleCard>
      ))}
    </div>
  ),
};
export const Borders: Story = { ...AllVariants };
export const AllSizes: Story = {
  name: "All sizes",
  parameters: gallery(
    ["size", "query"],
    "Each sample fixes the row density. Border, wrapping, loading, highlight and row-control arguments remain editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-col gap-5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ExampleCard
          key={size}
          title={
            { sm: "Small · 48px", md: "Medium · 54px", lg: "Large · 60px" }[
              size
            ]
          }
          description="Minimum body-row height. Wrapped content may need taller rows."
        >
          <TableExample args={{ ...args, size }} />
        </ExampleCard>
      ))}
    </div>
  ),
};
export const Sizes: Story = { ...AllSizes };
export const ContentWrapping: Story = {
  name: "Content wrapping",
  parameters: gallery(
    ["wrapContent", "query"],
    "The wrapping behavior is fixed for each sample. Other controls apply to both tables. Any horizontal scrolling stays inside the table."
  ),
  render: (args) => (
    <div className="grid max-w-full grid-cols-1 gap-5 md:grid-cols-2">
      {[false, true].map((wrapContent) => (
        <ExampleCard
          key={String(wrapContent)}
          title={wrapContent ? "Wrapped content" : "Horizontal scroll"}
          description={
            wrapContent
              ? "Long names wrap and the row grows."
              : "Names stay on one line; scroll the table to read every column."
          }
        >
          <TableExample args={{ ...args, wrapContent }} />
        </ExampleCard>
      ))}
    </div>
  ),
};

export const States: Story = {
  args: { wrapContent: true, showToggle: false, rows: [CAMPAIGNS[0]] },
  parameters: gallery(
    ["isLoading", "empty", "highlighted", "query"],
    "The row state is fixed by each card. Density, wrapping, frame, live data and row-control arguments apply throughout. Hover is forced only on its sample."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1120px] grid-cols-2 items-start gap-5">
        {(
          [
            {
              title: "Default",
              description: "Normal data rows.",
              isLoading: false,
              empty: false,
              highlighted: false,
            },
            {
              title: "Hover",
              description: "Forced hover surface.",
              rowState: "hover",
              isLoading: false,
              empty: false,
              highlighted: false,
            },
            {
              title: "Selected",
              description: "data-state=selected surface.",
              rowState: "selected",
              isLoading: false,
              empty: false,
              highlighted: false,
            },
            {
              title: "Highlighted",
              description: "Explicit informational row highlight.",
              isLoading: false,
              empty: false,
              highlighted: true,
            },
            {
              title: "Loading",
              description: "Skeleton rows replace the body.",
              isLoading: true,
              empty: false,
              highlighted: false,
            },
            {
              title: "Empty",
              description: "One message spans every visible column.",
              isLoading: false,
              empty: true,
              highlighted: false,
            },
          ] as const
        ).map((state) => (
          <ExampleCard
            key={state.title}
            title={state.title}
            description={state.description}
          >
            <TableExample
              args={{
                ...args,
                isLoading: state.isLoading,
                empty: state.empty,
                highlighted: state.highlighted,
              }}
              rowState={"rowState" in state ? state.rowState : undefined}
            />
          </ExampleCard>
        ))}
      </div>
    </div>
  ),
};

export const V1VsV2: Story = {
  name: "v1 vs v2",
  args: { wrapContent: true, showToggle: false },
  parameters: gallery(
    ["size", "withoutBorder", "query"],
    "Each density is shown with and without a frame in both versions. Every other relevant argument applies to both; switches stay independent."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[1120px] grid-cols-2 items-start gap-5">
        {(["sm", "md", "lg"] as const).flatMap((size) =>
          [false, true].flatMap((withoutBorder) =>
            (["v1", "v2"] as const).map((version) => (
              <ExampleCard
                key={version + size + String(withoutBorder)}
                title={
                  version +
                  " · " +
                  size +
                  (withoutBorder ? " · borderless" : " · framed")
                }
                description={
                  version === "v2"
                    ? "Inter, 60px uppercase header, 24px cell padding."
                    : "Current v1 component with its original styling."
                }
              >
                <TableExample
                  args={{ ...args, size, withoutBorder }}
                  version={version}
                />
              </ExampleCard>
            ))
          )
        )}
      </div>
    </div>
  ),
};

function CampaignManagement({
  updateArgs,
  ...args
}: ExampleArgs & { updateArgs: (next: Partial<ExampleArgs>) => void }) {
  const [selected, setSelected] = React.useState<number[]>([]);
  const [direction, setDirection] = React.useState<"asc" | "desc">("asc");
  const [message, setMessage] = React.useState("");
  const data = args.rows
    .filter((row) => row.name.toLowerCase().includes(args.query.toLowerCase()))
    .sort((a, b) =>
      direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  const visibleSelected = data.filter((row) =>
    selected.includes(row.id)
  ).length;
  const selection =
    visibleSelected === 0
      ? false
      : visibleSelected === data.length
        ? true
        : "indeterminate";
  const columns = 4 + Number(args.showToggle) + Number(args.showActions);
  return (
    <div className="max-w-full rounded-lg border border-semantic-border-layout p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
            Campaigns
          </h3>
          <p className="m-0 mt-1 text-xs text-semantic-text-muted">
            Select campaigns, sort their names and update their enabled state.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={args.disabled || args.isLoading || selected.length === 0}
          onClick={() => {
            updateArgs({
              rows: args.rows.map((row) =>
                selected.includes(row.id) ? { ...row, enabled: false } : row
              ),
            });
            setMessage(
              "Paused " +
                selected.length +
                " selected campaign" +
                (selected.length === 1 ? "" : "s")
            );
          }}
        >
          Pause selected
        </Button>
      </div>
      <div className="my-4 flex flex-wrap items-center gap-3">
        <div className="w-[320px] max-w-full">
          <Input
            value={args.query}
            disabled={args.disabled}
            aria-label="Search campaigns"
            placeholder="Search campaigns"
            onChange={(event) => updateArgs({ query: event.target.value })}
          />
        </div>
        <p className="m-0 text-xs text-semantic-text-muted" role="status">
          {visibleSelected} of {data.length} visible campaigns selected
        </p>
      </div>
      <V2.Table
        size={args.size}
        withoutBorder={args.withoutBorder}
        wrapContent={args.wrapContent}
        className={args.className}
        aria-label="Manage campaigns"
        aria-busy={args.isLoading || undefined}
      >
        <V2.TableHeader>
          <V2.TableRow>
            <V2.TableHead scope="col">
              <Checkbox
                checked={selection}
                disabled={
                  args.disabled ||
                  args.isLoading ||
                  args.empty ||
                  data.length === 0
                }
                aria-label="Select all visible campaigns"
                onCheckedChange={(checked) =>
                  setSelected((previous) =>
                    checked
                      ? [
                          ...new Set([
                            ...previous,
                            ...data.map((row) => row.id),
                          ]),
                        ]
                      : previous.filter(
                          (id) => !data.some((row) => row.id === id)
                        )
                  )
                }
              />
            </V2.TableHead>
            <V2.TableHead
              scope="col"
              sortDirection={direction}
              aria-sort={direction === "asc" ? "ascending" : "descending"}
            >
              <button
                type="button"
                disabled={args.disabled}
                className="rounded text-left font-medium uppercase focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed"
                aria-label="Sort campaigns by name"
                onClick={() =>
                  setDirection((previous) =>
                    previous === "asc" ? "desc" : "asc"
                  )
                }
              >
                Campaign
              </button>
            </V2.TableHead>
            <V2.TableHead scope="col">Status</V2.TableHead>
            <V2.TableHead scope="col">Contacts</V2.TableHead>
            {args.showToggle && (
              <V2.TableHead scope="col">Enabled</V2.TableHead>
            )}
            {args.showActions && (
              <V2.TableHead scope="col">Actions</V2.TableHead>
            )}
          </V2.TableRow>
        </V2.TableHeader>
        <V2.TableBody
          isLoading={args.isLoading}
          loadingRows={args.loadingRows}
          loadingColumns={columns}
        >
          {args.empty || data.length === 0 ? (
            <V2.TableEmpty colSpan={columns}>
              No matching campaigns. Try another search.
            </V2.TableEmpty>
          ) : (
            data.map((row) => (
              <V2.TableRow
                key={row.id}
                highlighted={args.highlighted}
                data-state={selected.includes(row.id) ? "selected" : undefined}
              >
                <V2.TableCell>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    disabled={args.disabled}
                    aria-label={"Select " + row.name}
                    onCheckedChange={(checked) =>
                      setSelected((previous) =>
                        checked
                          ? [...previous, row.id]
                          : previous.filter((id) => id !== row.id)
                      )
                    }
                  />
                </V2.TableCell>
                <V2.TableCell className="font-medium">{row.name}</V2.TableCell>
                <V2.TableCell>
                  <Badge variant={row.enabled ? "active" : "disabled"}>
                    {row.enabled ? "Active" : "Paused"}
                  </Badge>
                </V2.TableCell>
                <V2.TableCell>
                  {row.contacts.toLocaleString("en-US")}
                </V2.TableCell>
                {args.showToggle && (
                  <V2.TableCell>
                    <V2.TableToggle
                      checked={row.enabled}
                      disabled={args.disabled}
                      aria-label={"Enable " + row.name}
                      onCheckedChange={(enabled) => {
                        args.onEnabledChange(row.id, enabled);
                        updateArgs({
                          rows: args.rows.map((item) =>
                            item.id === row.id ? { ...item, enabled } : item
                          ),
                        });
                      }}
                    />
                  </V2.TableCell>
                )}
                {args.showActions && (
                  <V2.TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      disabled={args.disabled}
                      onClick={() => {
                        args.onRowAction(row.id, "view");
                        setMessage("Selected " + row.name + " for review");
                      }}
                    >
                      View details
                    </Button>
                  </V2.TableCell>
                )}
              </V2.TableRow>
            ))
          )}
        </V2.TableBody>
      </V2.Table>
      <p className="m-0 mt-4 text-xs text-semantic-text-muted" role="status">
        {message ||
          "This example uses local data; actions affect only this preview."}
      </p>
    </div>
  );
}
export const Usage: Story = {
  args: { wrapContent: true, showActions: true },
  parameters: {
    docs: {
      description: {
        story:
          "Working selection, keyboard-accessible sorting and bulk pause. Typing updates the query control, row toggles update rows, and Controls immediately update the example. Border, density, wrapping, loading and disabled controls remain active.",
      },
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ExampleArgs>();
    return <CampaignManagement {...args} updateArgs={updateArgs} />;
  },
};
export const HeaderFunctionality: Story = {
  ...Usage,
  name: "Header functionality",
};

export const StickyColumn: Story = {
  name: "Sticky column",
  args: { wrapContent: false, showActions: true },
  parameters: gallery(
    ["query"],
    "The first column stays attached to the left when the table scrolls horizontally. Wrapping, density, loading and row-control arguments remain editable."
  ),
  render: (args) => (
    <div className="max-w-[700px]">
      <TableExample args={args} sticky />
    </div>
  ),
};
export const Scroll: Story = {
  parameters: gallery(
    ["query"],
    "Scroll vertically through the constrained frame, and horizontally inside the table when names do not wrap. Controls apply to the rendered table."
  ),
  args: {
    rows: Array.from({ length: 12 }, (_, index) => ({
      ...CAMPAIGNS[index % CAMPAIGNS.length],
      id: index + 1,
      name: CAMPAIGNS[index % CAMPAIGNS.length].name + " " + (index + 1),
    })),
  },
  render: (args) => (
    <div className="max-h-[340px] max-w-full overflow-auto">
      <TableExample args={args} />
    </div>
  ),
};
export const VirtualizedScroll: Story = {
  ...Scroll,
  name: "Long list (not virtualized)",
  args: {
    rows: Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: "Campaign " + (index + 1),
      owner: "AK",
      contacts: 100 + index,
      enabled: index % 2 === 0,
    })),
  },
  parameters: gallery(
    ["query"],
    "A scrollable 100-row example. Table does not implement virtualization; use a separate virtualizer for substantially larger datasets. All exposed controls apply to this table."
  ),
};
export const PaginationLoading: Story = {
  name: "Pagination loading",
  args: { isLoading: true, loadingRows: 2 },
  parameters: PLAYGROUND,
};
export const WithStackedTags: Story = {
  name: "With stacked tags",
  parameters: gallery(
    [
      "showToggle",
      "showActions",
      "rows",
      "query",
      "disabled",
      "onEnabledChange",
      "onRowAction",
    ],
    "A composed tag column. Density, frame, wrapping, loading, skeleton count, empty and highlighted-row controls apply to the table."
  ),
  render: (args) => (
    <V2.Table
      size={args.size}
      withoutBorder={args.withoutBorder}
      wrapContent={args.wrapContent}
      className={args.className}
      aria-label="Tagged campaigns"
    >
      <V2.TableHeader>
        <V2.TableRow>
          <V2.TableHead scope="col">Campaign</V2.TableHead>
          <V2.TableHead scope="col">Tags</V2.TableHead>
        </V2.TableRow>
      </V2.TableHeader>
      <V2.TableBody
        isLoading={args.isLoading}
        loadingRows={args.loadingRows}
        loadingColumns={2}
      >
        {args.empty ? (
          <V2.TableEmpty colSpan={2}>No tagged campaigns.</V2.TableEmpty>
        ) : (
          CAMPAIGNS.map((row) => (
            <V2.TableRow key={row.id} highlighted={args.highlighted}>
              <V2.TableCell>{row.name}</V2.TableCell>
              <V2.TableCell>
                <TagGroup
                  tags={(row.enabled
                    ? ["Customer", "Automated", "Priority", "Follow-up"]
                    : ["Draft", "Review"]
                  ).map((value) => ({ value }))}
                  maxVisible={2}
                />
              </V2.TableCell>
            </V2.TableRow>
          ))
        )}
      </V2.TableBody>
    </V2.Table>
  ),
};
export const WebhookTable: Story = {
  name: "Webhook table",
  args: {
    rows: [
      {
        id: 1,
        name: "https://example.com/events/messages",
        owner: "AK",
        contacts: 240,
        enabled: true,
      },
      {
        id: 2,
        name: "https://example.com/events/contacts",
        owner: "SP",
        contacts: 128,
        enabled: false,
      },
    ],
    showActions: true,
    wrapContent: true,
  },
  parameters: PLAYGROUND,
};
export const DosAndDonts: Story = {
  name: "Density guidance",
  parameters: gallery(
    ["query"],
    "Both examples use the same editable table arguments. Match row density to content: one-line data fits compact rows; longer labels need wrapping or a contained horizontal scroll."
  ),
  render: (args) => (
    <div className="grid max-w-full grid-cols-1 gap-5 md:grid-cols-2">
      <ExampleCard
        title="Keep columns readable"
        description="Group related labels and give the table its own scroll container."
      >
        <TableExample args={args} />
      </ExampleCard>
      <ExampleCard
        title="Plan for longer content"
        description="Check names and statuses before choosing a density."
      >
        <TableExample args={args} />
      </ExampleCard>
    </div>
  ),
};
