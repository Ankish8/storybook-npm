import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import * as V2 from "./pagination";
import * as V1 from "../pagination";
import { Input } from "./input";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = V2.PaginationWidgetProps & {
  composition: "widget" | "links";
  showInfo: boolean;
  iconsOnly: boolean;
  linkSize?: "sm" | "default" | "lg" | "icon";
  query: string;
};
function range(
  current: number,
  total: number,
  siblings: number
): (number | "ellipsis")[] {
  const pages = new Set([1, total]);
  for (
    let p = Math.max(1, current - siblings);
    p <= Math.min(total, current + siblings);
    p++
  )
    pages.add(p);
  if (total <= 7) for (let p = 1; p <= total; p++) pages.add(p);
  const result: (number | "ellipsis")[] = [];
  const ordered = [...pages].sort((a, b) => a - b);
  ordered.forEach((page, index) => {
    if (index > 0 && page - ordered[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}
function Sample({
  args,
  version = "v2",
  updatePage,
  forceState,
}: {
  args: Args;
  version?: "v1" | "v2";
  updatePage?: (page: number) => void;
  forceState?: "hover" | "focus";
}) {
  const UI = version === "v1" ? V1 : V2;
  const total = Math.max(1, args.totalPages);
  const seeded = Math.max(1, Math.min(args.currentPage, total));
  const [page, setPage] = React.useState(seeded);
  const [seed, setSeed] = React.useState(seeded);
  if (seed !== seeded) {
    setSeed(seeded);
    setPage(seeded);
  }
  const current = updatePage ? seeded : page;
  const change = (next: number) => {
    args.onPageChange(next);
    if (updatePage) updatePage(next);
    else setPage(next);
  };
  const className =
    (version === "v1" ? "font-sans " : "") +
    (args.iconsOnly ? "[&_a>span]:hidden" : "");
  if (args.composition === "widget")
    return (
      <UI.PaginationWidget
        currentPage={current}
        totalPages={total}
        siblingCount={args.siblingCount}
        onPageChange={change}
        align={args.align}
        totalItems={args.showInfo ? args.totalItems : undefined}
        pageSize={args.showInfo ? args.pageSize : undefined}
        className={className}
      />
    );
  const controls = (
    <UI.Pagination
      className={"mx-0 w-auto " + (args.showInfo ? "p-0 " : "") + className}
    >
      <UI.PaginationContent>
        <UI.PaginationItem>
          <UI.PaginationPrevious
            href="#"
            disabled={current === 1}
            onClick={(e) => {
              e.preventDefault();
              if (current > 1) change(current - 1);
            }}
          />
        </UI.PaginationItem>
        {range(current, total, args.siblingCount ?? 1).map((page, index) => (
          <UI.PaginationItem key={page + "-" + index}>
            {page === "ellipsis" ? (
              <UI.PaginationEllipsis />
            ) : (
              <UI.PaginationLink
                href="#"
                aria-label={"Page " + page}
                size={args.linkSize}
                isActive={page === current}
                className={
                  page === current && forceState === "hover"
                    ? "pseudo-hover"
                    : page === current && forceState === "focus"
                      ? "pseudo-focus-visible"
                      : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  change(page);
                }}
              >
                {page}
              </UI.PaginationLink>
            )}
          </UI.PaginationItem>
        ))}
        <UI.PaginationItem>
          <UI.PaginationNext
            href="#"
            disabled={current === total}
            onClick={(e) => {
              e.preventDefault();
              if (current < total) change(current + 1);
            }}
          />
        </UI.PaginationItem>
      </UI.PaginationContent>
    </UI.Pagination>
  );
  return (
    <div
      className={
        "flex flex-wrap items-center gap-3 " +
        (args.align === "start"
          ? "justify-start"
          : args.align === "end"
            ? "justify-end"
            : "justify-center")
      }
    >
      {args.showInfo && (
        <UI.PaginationInfo
          currentPage={current}
          pageSize={args.pageSize || 10}
          totalItems={args.totalItems || 0}
        />
      )}
      {controls}
    </div>
  );
}
const controlNames = [
  "currentPage",
  "totalPages",
  "siblingCount",
  "align",
  "onPageChange",
  "composition",
  "showInfo",
  "totalItems",
  "pageSize",
  "iconsOnly",
  "linkSize",
];
const meta: Meta<Args> = {
  title: "V2/Components/Pagination",
  component: V2.PaginationWidget,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-11830",
    },
    layout: "padded",
    controls: { include: controlNames },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "pagination",
          exportName:
            "PaginationWidget, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, PaginationInfo",
          summary:
            "Page navigation with a ready-to-use widget or composable links, ellipses and an optional item range.",
          changes: [
            [
              "Controls",
              "36px default icon controls",
              "32px default links and previous/next controls",
            ],
            [
              "Spacing",
              "Unpadded navigation",
              "10px outer padding and 12px group gap",
            ],
            ["Typography", "Inherited font", "Inter and v2 Button labels"],
            [
              "Selection",
              "Widget currentPage/onPageChange",
              "Existing API and ellipsis algorithm retained",
            ],
            [
              "Composable sizes",
              "Button size override",
              "Existing size overrides still available",
            ],
          ],
          tokens: [
            ["Active surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Active label", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Muted label", "--semantic-text-muted", "#717680", "#717680"],
            ["Border", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Focus", "--semantic-primary", "#343E55", "#343E55"],
          ],
          guidance:
            "Use PaginationWidget for existing numbered-page behavior. For custom content, compose PaginationLink and keep each link's navigation callback local or routed. currentPage is 1-based. totalItems/pageSize supply the range summary. Composition, iconsOnly and linkSize below configure the example; linkSize is applied only to composed PaginationLink samples.",
        }),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  args: {
    currentPage: 3,
    totalPages: 12,
    siblingCount: 1,
    align: "center",
    totalItems: 120,
    pageSize: 10,
    composition: "widget",
    showInfo: false,
    iconsOnly: false,
    linkSize: undefined,
    query: "",
    onPageChange: fn(),
  },
  argTypes: {
    currentPage: { control: { type: "number", min: 1, max: 20, step: 1 } },
    totalPages: { control: { type: "number", min: 1, max: 20, step: 1 } },
    siblingCount: { control: { type: "number", min: 0, max: 3, step: 1 } },
    align: { control: "select", options: ["start", "center", "end"] },
    onPageChange: { control: false },
    totalItems: {
      control: { type: "number", min: 0, max: 500, step: 1 },
      if: { arg: "showInfo", truthy: true },
    },
    pageSize: {
      control: { type: "number", min: 1, max: 50, step: 1 },
      if: { arg: "showInfo", truthy: true },
    },
    composition: {
      control: "select",
      options: ["widget", "links"],
      table: { category: "Example" },
    },
    showInfo: { control: "boolean", table: { category: "Example" } },
    iconsOnly: { control: "boolean", table: { category: "Example" } },
    linkSize: {
      control: "select",
      options: [undefined, "sm", "default", "lg", "icon"],
      if: { arg: "composition", eq: "links" },
      table: { category: "PaginationLink" },
    },
    query: { control: "text", table: { category: "Example" } },
  },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    const current = Math.max(
      1,
      Math.min(args.currentPage, Math.max(1, args.totalPages))
    );
    React.useEffect(() => {
      if (args.currentPage !== current) update({ currentPage: current });
    }, [args.currentPage, current, update]);
    return (
      <Sample
        args={args}
        updatePage={(currentPage) => update({ currentPage })}
      />
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const WithMorePages: Story = {
  args: { currentPage: 10, totalPages: 20, totalItems: 200 },
};
export const FirstPageActive: Story = { args: { currentPage: 1 } };
export const LastPageActive: Story = { args: { currentPage: 12 } };
export const IconsOnly: Story = { args: { iconsOnly: true } };
export const FewPages: Story = {
  args: { currentPage: 2, totalPages: 3, totalItems: 30 },
};
export const Widget: Story = {};
export const WidgetFirstPage: Story = { ...FirstPageActive };
export const WidgetLastPage: Story = { ...LastPageActive };
export const WidgetFewPages: Story = { ...FewPages };
export const ComposedLinks: Story = { args: { composition: "links" } };
export const WithItemCount: Story = { args: { showInfo: true, align: "end" } };
export const PaginationInfoOnly: Story = {
  args: { showInfo: true },
  parameters: {
    controls: { include: ["currentPage", "pageSize", "totalItems"] },
  },
  render: (args) => (
    <V2.PaginationInfo
      currentPage={args.currentPage}
      pageSize={args.pageSize || 10}
      totalItems={args.totalItems || 0}
    />
  ),
};
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-4 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        {title}
      </h3>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[650px]">{children}</div>
      </div>
    </section>
  );
}
export const AllCompositions: Story = {
  parameters: gallery(
    ["composition"],
    "Widget and composed links are fixed. Page, range, alignment and label-visibility controls apply to both independent examples."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4">
      {(["widget", "links"] as const).map((composition) => (
        <Card key={composition} title={composition}>
          <Sample args={{ ...args, composition }} />
        </Card>
      ))}
    </div>
  ),
};
export const ItemCountAlignments: Story = {
  name: "All alignments",
  args: { showInfo: true },
  parameters: gallery(
    ["align"],
    "Start, Center and End alignments are fixed. Other page and summary controls remain editable."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4">
      {(["start", "center", "end"] as const).map((align) => (
        <Card key={align} title={align}>
          <Sample args={{ ...args, align }} />
        </Card>
      ))}
    </div>
  ),
};
export const States: Story = {
  args: { composition: "links" },
  parameters: gallery(
    ["currentPage", "composition"],
    "Composed links show Default, Hover, Focus, First page and Last page. Page and composition are fixed per card; counts, range, alignment and link size remain live."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4">
      {["Default", "Hover", "Focus", "First page", "Last page"].map((state) => (
        <Card key={state} title={state}>
          <Sample
            args={{
              ...args,
              composition: "links",
              currentPage:
                state === "First page"
                  ? 1
                  : state === "Last page"
                    ? args.totalPages
                    : Math.min(3, args.totalPages),
            }}
            forceState={
              state === "Hover"
                ? "hover"
                : state === "Focus"
                  ? "focus"
                  : undefined
            }
          />
        </Card>
      ))}
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    [],
    "Both current implementations use the same live data, composition, alignment and summary controls. v1 keeps its original default sizing and font."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4">
      {(["v1", "v2"] as const).map((version) => (
        <Card key={version} title={version}>
          <Sample args={args} version={version} />
        </Card>
      ))}
    </div>
  ),
};
function Contacts({
  args,
  update,
}: {
  args: Args;
  update: (next: Partial<Args>) => void;
}) {
  const all = Array.from(
    { length: Math.max(0, Math.min(500, args.totalItems || 0)) },
    (_, i) => "Contact " + String(i + 1).padStart(3, "0")
  );
  const filtered = all.filter((name) =>
    name.toLowerCase().includes(args.query.toLowerCase())
  );
  const pageSize = Math.max(1, args.pageSize || 10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.max(1, Math.min(args.currentPage, totalPages));
  React.useEffect(() => {
    if (args.currentPage !== current) update({ currentPage: current });
  }, [args.currentPage, current, update]);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);
  return (
    <section className="max-w-[950px] rounded-lg border border-semantic-border-layout p-5">
      <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Contacts
      </h3>
      <p className="m-0 mt-1 mb-4 text-xs text-[var(--v2-text-muted,#707070)]">
        Page a local list or filter it. Selection and query stay synchronized
        with Controls.
      </p>
      <label
        htmlFor="pagination-search"
        className="mb-2 block text-sm font-medium text-[var(--v2-text-primary,#484848)]"
      >
        Search contacts
      </label>
      <Input
        id="pagination-search"
        value={args.query}
        onChange={(e) => update({ query: e.target.value, currentPage: 1 })}
      />
      <ul className="m-0 my-4 list-none p-0">
        {visible.map((name) => (
          <li
            key={name}
            className="border-b border-semantic-border-layout py-3 text-sm text-[var(--v2-text-primary,#484848)]"
          >
            {name}
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-5 text-sm text-[var(--v2-text-muted,#707070)]">
            No matching contacts.
          </li>
        )}
      </ul>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[650px]">
          <Sample
            args={{
              ...args,
              currentPage: current,
              totalPages,
              totalItems: filtered.length,
              pageSize,
            }}
            updatePage={(currentPage) => update({ currentPage })}
          />
        </div>
      </div>
    </section>
  );
}
export const Usage: Story = {
  args: {
    currentPage: 1,
    totalItems: 42,
    pageSize: 5,
    showInfo: true,
    align: "end",
    query: "",
  },
  parameters: {
    ...gallery(
      ["totalPages"],
      "Total pages comes from the filtered local list. Total items, page size, query, composition and presentation controls configure the example."
    ),
    controls: { include: [...controlNames, "query"], exclude: ["totalPages"] },
  },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <Contacts args={args} update={update} />;
  },
};
export const Accessibility: Story = {
  args: { composition: "links", currentPage: 1 },
  parameters: {
    docs: {
      description: {
        story:
          "Active links expose aria-current=page. Previous/Next expose aria-disabled at boundaries. Use Tab and Enter to exercise navigation without leaving Storybook; this example prevents native navigation and updates currentPage.",
      },
    },
  },
};
