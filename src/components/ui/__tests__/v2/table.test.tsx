import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableSkeleton,
  TableEmpty,
  TableAvatar,
  TableToggle,
  useTableSort,
  type TableSort,
} from "../../v2/table";

describe("Table", () => {
  it("renders a basic table structure", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Item 1</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders with border by default", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const wrapper = screen.getByRole("table").parentElement;
    expect(wrapper).toHaveClass("border");
    expect(wrapper).toHaveClass("border-semantic-border-layout");
  });

  it("renders without border when withoutBorder is true", () => {
    render(
      <Table withoutBorder>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const wrapper = screen.getByRole("table").parentElement;
    expect(wrapper).not.toHaveClass("border");
  });

  it.each([
    ["sm", "[&_td]:py-1.5"],
    ["md", "[&_td]:py-2"],
    ["lg", "[&_td]:py-3"],
  ] as const)("renders %s size variant", (size, expectedClass) => {
    render(
      <Table size={size}>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toHaveClass(expectedClass);
  });

  it("applies custom className to Table", () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toHaveClass("custom-table");
  });

  it("applies nowrap to cells by default", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toHaveClass(
      "[&_th]:whitespace-nowrap",
      "[&_td]:whitespace-nowrap"
    );
  });

  it("removes nowrap when wrapContent is true", () => {
    render(
      <Table wrapContent>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).not.toHaveClass(
      "[&_th]:whitespace-nowrap"
    );
    expect(screen.getByRole("table")).not.toHaveClass(
      "[&_td]:whitespace-nowrap"
    );
  });
});

describe("TableHeader", () => {
  it("renders with correct background", () => {
    render(
      <Table>
        <TableHeader data-testid="header">
          <TableRow>
            <TableHead>Title</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByTestId("header")).toHaveClass(
      "bg-semantic-primary-surface"
    );
  });
});

describe("TableRow", () => {
  it("renders with border by default", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId("row")).toHaveClass("border-b");
  });

  it("renders highlighted row", () => {
    render(
      <Table>
        <TableBody>
          <TableRow highlighted data-testid="row">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId("row")).toHaveClass("bg-semantic-info-surface");
  });

  it("renders non-highlighted row with hover styles", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    // Hover is gated to hover-capable pointers so it never sticks after a tap.
    expect(screen.getByTestId("row")).toHaveClass(
      "[@media(hover:hover)]:hover:bg-semantic-bg-ui"
    );
  });

  it("tints a selected row differently from hover and keeps the tint under the pointer", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row" data-state="selected">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const row = screen.getByTestId("row");
    // info surface (#ECF1FB) for selection; bg-ui (#F5F5F5) stays the hover fill
    expect(row).toHaveClass("data-[state=selected]:bg-semantic-info-surface");
    expect(row).toHaveClass(
      "data-[state=selected]:[@media(hover:hover)]:hover:bg-semantic-info-surface"
    );
    expect(row).not.toHaveClass("data-[state=selected]:bg-semantic-bg-ui");
    expect(row).toHaveClass("[@media(hover:hover)]:hover:bg-semantic-bg-ui");
  });

  it("shows a visible focus ring on a focusable row", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row" tabIndex={0}>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId("row")).toHaveClass(
      "focus-visible:outline",
      "focus-visible:outline-semantic-primary"
    );
  });
});

describe("TableHead", () => {
  it("renders column header", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column Title</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByRole("columnheader")).toHaveTextContent("Column Title");
  });

  it("renders sticky column", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sticky data-testid="head">
              Sticky Column
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByTestId("head")).toHaveClass("sticky");
    expect(screen.getByTestId("head")).toHaveClass("left-0");
  });

  it("renders sort indicator for ascending", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc">Sortable</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByText("↑")).toBeInTheDocument();
  });

  it("renders sort indicator for descending", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="desc">Sortable</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByText("↓")).toBeInTheDocument();
  });

  it("renders info tooltip", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead infoTooltip="Help text">With Info</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const infoIcon = screen.getByTitle("Help text");
    expect(infoIcon).toBeInTheDocument();
  });

  it("sets aria-sort from sortDirection", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc">Ascending</TableHead>
            <TableHead sortDirection="desc">Descending</TableHead>
            <TableHead sortable>Unsorted</TableHead>
            <TableHead sortDirection={null}>Null (v1: not sorted)</TableHead>
            <TableHead>Plain</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const heads = screen.getAllByRole("columnheader");
    expect(heads[0]).toHaveAttribute("aria-sort", "ascending");
    expect(heads[1]).toHaveAttribute("aria-sort", "descending");
    expect(heads[2]).toHaveAttribute("aria-sort", "none");
    // sortDirection={null} keeps v1's meaning (no sort, nothing shown); only `sortable` opts in.
    expect(heads[3]).not.toHaveAttribute("aria-sort");
    expect(heads[4]).not.toHaveAttribute("aria-sort");
  });

  it("lets a host-supplied aria-sort override the derived one", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc" aria-sort="other">
              Custom
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "other"
    );
  });

  it("falls back to the derived aria-sort when the host passes undefined", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="desc" aria-sort={undefined}>
              Conditional
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "descending"
    );
  });

  it("draws a 16px arrow for a sorted column and turns it over for desc", () => {
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc">Sortable</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    // the v1 text glyph stays in the DOM, but is hidden from assistive tech
    const glyph = screen.getByText("↑");
    expect(glyph.parentElement).toHaveAttribute("aria-hidden", "true");
    const arrow = screen.getByRole("columnheader").querySelector("svg");
    expect(arrow).toHaveClass("size-4", "opacity-100");
    expect(arrow).not.toHaveClass("rotate-180");

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="desc">Sortable</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByText("↓")).toBeInTheDocument();
    expect(screen.getByRole("columnheader").querySelector("svg")).toHaveClass(
      "rotate-180"
    );
  });

  it("renders sortDirection={null} exactly like v1: no glyph, no pointer cursor", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection={null} data-testid="head">
              Unsorted
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const head = screen.getByTestId("head");
    expect(head.querySelector("svg")).toBeNull();
    expect(head).not.toHaveClass("cursor-pointer");
    expect(head).not.toHaveAttribute("aria-sort");
  });

  it("keeps the idle sort affordance visible without hover and strengthens it on focus", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable data-testid="head">
              Unsorted
            </TableHead>
            <TableHead data-testid="plain">Plain</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    const head = screen.getByTestId("head");
    const icon = head.querySelector("svg");
    expect(icon).toHaveClass("size-4", "opacity-40");
    expect(icon).toHaveClass("group-focus-within/head:opacity-100");
    expect(icon).toHaveClass(
      "[@media(hover:hover)]:group-hover/head:opacity-70"
    );
    expect(head).toHaveTextContent("Unsorted");
    expect(head).not.toHaveTextContent("↑");
    expect(head).toHaveClass("cursor-pointer");
    expect(screen.getByTestId("plain").querySelector("svg")).toBeNull();
    expect(screen.getByTestId("plain")).not.toHaveClass("cursor-pointer");
  });

  it("applies cursor-pointer when sortable", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc" data-testid="head">
              Sortable
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByTestId("head")).toHaveClass("cursor-pointer");
  });
});

describe("TableCell", () => {
  it("renders cell content", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("cell")).toHaveTextContent("Cell Content");
  });

  it("renders sticky cell", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sticky data-testid="cell">
              Sticky Cell
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId("cell")).toHaveClass("sticky");
    expect(screen.getByTestId("cell")).toHaveClass("left-0");
  });
});

describe("TableFooter", () => {
  it("renders footer with correct styles", () => {
    render(
      <Table>
        <TableFooter data-testid="footer">
          <TableRow>
            <TableCell>Footer Content</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByTestId("footer")).toHaveClass("border-t");
    expect(screen.getByTestId("footer")).toHaveClass(
      "bg-semantic-primary-surface"
    );
  });
});

describe("TableCaption", () => {
  it("renders caption", () => {
    render(
      <Table>
        <TableCaption>Table description</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Table description")).toBeInTheDocument();
  });
});

describe("TableSkeleton", () => {
  it("renders default 5 rows and 5 columns", () => {
    render(
      <Table>
        <TableBody>
          <TableSkeleton />
        </TableBody>
      </Table>
    );

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(5);

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(25); // 5 rows * 5 columns
  });

  it("renders custom number of rows and columns", () => {
    render(
      <Table>
        <TableBody>
          <TableSkeleton rows={3} columns={2} />
        </TableBody>
      </Table>
    );

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(6); // 3 rows * 2 columns
  });

  it("renders animated skeleton elements", () => {
    render(
      <Table>
        <TableBody>
          <TableSkeleton rows={1} columns={1} />
        </TableBody>
      </Table>
    );

    const skeletonDiv = screen.getByRole("cell").querySelector("div");
    expect(skeletonDiv).toHaveClass("animate-pulse");
  });
});

describe("TableBody isLoading", () => {
  it("renders skeleton instead of children when isLoading is true", () => {
    render(
      <Table>
        <TableBody isLoading loadingRows={3} loadingColumns={4}>
          <TableRow>
            <TableCell>This should not render</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(
      screen.queryByText("This should not render")
    ).not.toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(12); // 3 rows * 4 columns
  });

  it("renders children when isLoading is false", () => {
    render(
      <Table>
        <TableBody isLoading={false} loadingRows={3} loadingColumns={4}>
          <TableRow>
            <TableCell>Visible content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Visible content")).toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1);
  });

  it("uses default 5 rows and 5 columns when loading props are not specified", () => {
    render(
      <Table>
        <TableBody isLoading>
          <TableRow>
            <TableCell>Hidden</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(5);
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(25); // 5 rows * 5 columns
  });
});

describe("TableEmpty", () => {
  it("renders default empty message", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3} />
        </TableBody>
      </Table>
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders custom empty message", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3}>Custom empty message</TableEmpty>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Custom empty message")).toBeInTheDocument();
  });

  it("spans correct number of columns", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={5} />
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("cell")).toHaveAttribute("colspan", "5");
  });
});

describe("TableAvatar", () => {
  it("renders initials", () => {
    render(<TableAvatar initials="JD" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("uses default color when not specified", () => {
    render(<TableAvatar initials="AB" />);
    const avatar = screen.getByText("AB");
    expect(avatar).toHaveStyle({ backgroundColor: "#7C3AED" });
  });

  it("uses custom color when specified", () => {
    render(<TableAvatar initials="XY" color="#FF0000" />);
    const avatar = screen.getByText("XY");
    expect(avatar).toHaveStyle({ backgroundColor: "#FF0000" });
  });

  it("has correct styling", () => {
    render(<TableAvatar initials="TS" />);
    const avatar = screen.getByText("TS");
    expect(avatar).toHaveClass("rounded-full");
    expect(avatar).toHaveClass("w-7");
    expect(avatar).toHaveClass("h-7");
  });
});

describe("Ref forwarding", () => {
  it("forwards ref to Table", () => {
    const ref = { current: null };
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it("forwards ref to TableRow", () => {
    const ref = { current: null };
    render(
      <Table>
        <TableBody>
          <TableRow ref={ref}>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
  });

  it("forwards ref to TableCell", () => {
    const ref = { current: null };
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell ref={ref}>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
  });
});

describe("Composed table behavior", () => {
  it("replaces loading rows with data without replacing the table", () => {
    const content = (isLoading: boolean) => (
      <Table aria-label="Campaigns" aria-busy={isLoading}>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Campaign</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody isLoading={isLoading} loadingRows={2} loadingColumns={1}>
          <TableRow>
            <TableCell>Welcome messages</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const { rerender } = render(content(true));
    const table = screen.getByRole("table", { name: "Campaigns" });
    expect(table).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.queryByText("Welcome messages")).not.toBeInTheDocument();
    rerender(content(false));
    expect(screen.getByRole("table", { name: "Campaigns" })).toBe(table);
    expect(table).toHaveAttribute("aria-busy", "false");
    expect(screen.getByRole("cell")).toHaveTextContent("Welcome messages");
  });

  it("preserves accessible headers and sort actions supplied by the host", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" sortDirection="asc" aria-sort="ascending">
              <button type="button" onClick={onSort}>
                Sort by name
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute("scope", "col");
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    await user.click(screen.getByRole("button", { name: "Sort by name" }));
    expect(onSort).toHaveBeenCalledOnce();
  });

  it("preserves selected-row attributes alongside highlight styling", () => {
    render(
      <Table>
        <TableBody>
          <TableRow highlighted data-state="selected" aria-selected="true">
            <TableCell>Selected campaign</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByRole("row");
    expect(row).toHaveAttribute("data-state", "selected");
    expect(row).toHaveAttribute("aria-selected", "true");
    expect(row).toHaveClass("bg-semantic-info-surface");
  });

  it("keeps sticky cells when content wrapping is enabled", () => {
    render(
      <Table wrapContent>
        <TableHeader>
          <TableRow>
            <TableHead sticky scope="col">
              Campaign
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell sticky>A longer campaign name</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("columnheader")).toHaveClass("sticky", "left-0");
    expect(screen.getByRole("cell")).toHaveClass("sticky", "left-0");
    expect(screen.getByRole("table")).not.toHaveClass(
      "[&_td]:whitespace-nowrap"
    );
  });

  it("spans an empty state across the requested visible columns", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={6}>
            <span>No matching campaigns</span>
          </TableEmpty>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("cell")).toHaveAttribute("colspan", "6");
    expect(screen.getByRole("cell")).toHaveTextContent("No matching campaigns");
  });
});

describe("TableToggle", () => {
  it("supports controlled updates with mouse and keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function ControlledToggle() {
      const [checked, setChecked] = React.useState(false);
      return (
        <TableToggle
          aria-label="Enable campaign"
          checked={checked}
          onCheckedChange={(next) => {
            onChange(next);
            setChecked(next);
          }}
        />
      );
    }
    render(<ControlledToggle />);
    const toggle = screen.getByRole("switch", { name: "Enable campaign" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(onChange.mock.calls.map(([checked]) => checked)).toEqual([
      true,
      false,
    ]);
  });

  it("does not update a disabled table control", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TableToggle
        aria-label="Enable campaign"
        checked
        disabled
        onCheckedChange={onChange}
      />
    );
    await user.click(screen.getByRole("switch", { name: "Enable campaign" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("forwards its ref and accessible description", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <>
        <TableToggle
          ref={ref}
          aria-label="Enable campaign"
          aria-describedby="toggle-hint"
        />
        <p id="toggle-hint">Controls campaign delivery.</p>
      </>
    );
    expect(ref.current).toBe(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAccessibleDescription(
      "Controls campaign delivery."
    );
  });
});

describe("Table stickyHeader", () => {
  const renderTable = (stickyHeader?: boolean) =>
    render(
      <Table stickyHeader={stickyHeader} data-testid="table">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

  it("is off by default", () => {
    renderTable();
    const table = screen.getByTestId("table");
    expect(table.className).not.toContain("sticky");
    expect(table.parentElement).not.toHaveClass(
      "max-h-[var(--v2-table-max-height,inherit)]"
    );
  });

  it("pins the header cells with a divider shadow and limits the frame height", () => {
    renderTable(true);
    const table = screen.getByTestId("table");
    expect(table).toHaveClass(
      "[&>thead>tr>th]:sticky",
      "[&>thead>tr>th]:top-0",
      "[&>thead>tr>th]:z-20",
      "[&>thead>tr>th]:bg-semantic-primary-surface"
    );
    expect(table.className).toContain(
      "[&>thead>tr>th]:shadow-[inset_0_-1px_0_0_var(--semantic-border-layout)]"
    );
    expect(table.parentElement).toHaveClass(
      "max-h-[var(--v2-table-max-height,inherit)]",
      "overflow-auto"
    );
  });

  it("does not leak stickyHeader onto the DOM", () => {
    renderTable(true);
    expect(screen.getByTestId("table")).not.toHaveAttribute("stickyheader");
  });
});

describe("TableSkeleton stagger", () => {
  it("starts each row 60ms after the previous one through a custom property", () => {
    render(
      <Table>
        <TableBody>
          <TableSkeleton rows={3} columns={1} />
        </TableBody>
      </Table>
    );
    const delays = screen
      .getAllByRole("cell")
      .map((cell) =>
        (cell.querySelector("div") as HTMLElement).style.getPropertyValue(
          "--v2-skeleton-delay"
        )
      );
    expect(delays).toEqual(["0ms", "60ms", "120ms"]);
  });
});

describe("useTableSort", () => {
  const data = Object.freeze([
    { id: "a", name: "Campaign 10", amount: 10 },
    { id: "b", name: "Campaign 2", amount: 2 },
    { id: "c", name: "Campaign 1", amount: 10 },
  ]);
  const columns = {
    name: { value: (row: (typeof data)[number]) => row.name },
    amount: { value: (row: (typeof data)[number]) => row.amount },
  };

  it("sorts natural text without mutating input and resets to its original order", () => {
    const { result } = renderHook(() => useTableSort(data, { columns }));
    act(() => result.current.sortBy("name"));
    expect(result.current.rows.map((row) => row.id)).toEqual(["c", "b", "a"]);
    act(() => result.current.sortBy("name"));
    expect(result.current.rows.map((row) => row.id)).toEqual(["a", "b", "c"]);
    act(() => result.current.sortBy("name"));
    expect(result.current.sort).toBeNull();
    expect(result.current.rows.map((row) => row.id)).toEqual(["a", "b", "c"]);
    expect(data.map((row) => row.id)).toEqual(["a", "b", "c"]);
  });

  it("compares numbers numerically and keeps equal records stable in both directions", () => {
    const { result } = renderHook(() => useTableSort(data, { columns }));
    act(() => result.current.sortBy("amount", "asc"));
    expect(result.current.rows.map((row) => row.id)).toEqual(["b", "a", "c"]);
    act(() => result.current.sortBy("amount", "desc"));
    expect(result.current.rows.map((row) => row.id)).toEqual(["a", "c", "b"]);
    expect(result.current.getSortDirection("amount")).toBe("desc");
    expect(result.current.getSortDirection("name")).toBeNull();
  });

  it("starts a new column ascending and allows explicit reset", () => {
    const { result } = renderHook(() =>
      useTableSort(data, {
        columns,
        defaultSort: { key: "amount", direction: "desc" },
      })
    );
    act(() => result.current.sortBy("name"));
    expect(result.current.sort).toEqual({ key: "name", direction: "asc" });
    act(() => result.current.resetSort());
    expect(result.current.rows).toEqual(data);
  });

  it("waits for controlled sort updates and reports resets as null", () => {
    const onSortChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ sort }: { sort: TableSort<"name" | "amount"> | null }) =>
        useTableSort(data, { columns, sort, onSortChange }),
      { initialProps: { sort: null as TableSort<"name" | "amount"> | null } }
    );
    act(() => result.current.sortBy("amount"));
    expect(onSortChange).toHaveBeenLastCalledWith({
      key: "amount",
      direction: "asc",
    });
    expect(result.current.rows).toEqual(data);
    rerender({ sort: { key: "amount", direction: "asc" } });
    expect(result.current.rows.map((row) => row.id)).toEqual(["b", "a", "c"]);
    act(() => result.current.resetSort());
    expect(onSortChange).toHaveBeenLastCalledWith(null);
    expect(result.current.sort).toEqual({ key: "amount", direction: "asc" });
  });

  it("accepts a custom comparator for domain-specific order", () => {
    const { result } = renderHook(() =>
      useTableSort(data, {
        columns: {
          name: {
            value: (row) => row.name,
            compare: (a, b) => b.name.length - a.name.length,
          },
        },
        defaultSort: { key: "name", direction: "asc" },
      })
    );
    expect(result.current.rows.map((row) => row.id)).toEqual(["a", "b", "c"]);
    act(() => result.current.sortBy("name", "desc"));
    expect(result.current.rows.map((row) => row.id)).toEqual(["b", "c", "a"]);
  });

  it("compares dates and leaves empty or invalid values last in both directions", () => {
    const records = [
      { id: "empty", date: null },
      { id: "late", date: new Date("2026-10-13") },
      { id: "invalid", date: new Date("invalid") },
      { id: "early", date: new Date("2026-10-01") },
    ];
    const { result } = renderHook(() =>
      useTableSort(records, {
        columns: { date: { value: (row) => row.date } },
      })
    );
    act(() => result.current.sortBy("date", "asc"));
    expect(result.current.rows.map((row) => row.id)).toEqual([
      "early",
      "late",
      "empty",
      "invalid",
    ]);
    act(() => result.current.sortBy("date", "desc"));
    expect(result.current.rows.map((row) => row.id)).toEqual([
      "late",
      "early",
      "empty",
      "invalid",
    ]);
  });

  it("applies an active sort to refreshed records without changing their identity", () => {
    const { result, rerender } = renderHook(
      ({ rows }) =>
        useTableSort(rows, {
          columns,
          defaultSort: { key: "amount", direction: "asc" },
        }),
      { initialProps: { rows: [...data] } }
    );
    const added = { id: "d", name: "Campaign 4", amount: 4 };
    rerender({ rows: [...data, added] });
    expect(result.current.rows.map((row) => row.id)).toEqual([
      "b",
      "d",
      "a",
      "c",
    ]);
    expect(result.current.rows[1]).toBe(added);
  });

  it("orders extreme numeric values without overflow and leaves NaN last", () => {
    const records = [Number.NaN, Infinity, 1e308, -1e308, -Infinity];
    const { result } = renderHook(() =>
      useTableSort(records, {
        columns: { amount: { value: (value) => value } },
        defaultSort: { key: "amount", direction: "asc" },
      })
    );
    expect(result.current.rows).toEqual([
      -Infinity,
      -1e308,
      1e308,
      Infinity,
      Number.NaN,
    ]);
    act(() => result.current.sortBy("amount", "desc"));
    expect(result.current.rows).toEqual([
      Infinity,
      1e308,
      -1e308,
      -Infinity,
      Number.NaN,
    ]);
  });
});

describe("TableHead native sorting", () => {
  it("reorders real rows while keyed checkbox state stays with its record", async () => {
    const records = [
      { id: "a", amount: 10 },
      { id: "b", amount: 2 },
    ];
    function ComposedTable() {
      const { rows, sortBy, getSortDirection } = useTableSort(records, {
        columns: { amount: { value: (row) => row.amount } },
      });
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Select</TableHead>
              <TableHead
                onSortChange={(direction) => sortBy("amount", direction)}
                sortDirection={getSortDirection("amount")}
              >
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} data-testid={"row-" + row.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    aria-label={"Select " + row.id}
                    defaultChecked={false}
                  />
                </TableCell>
                <TableCell>{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    render(<ComposedTable />);
    const user = userEvent.setup();
    const selectA = screen.getByRole("checkbox", { name: "Select a" });
    await user.click(selectA);
    await user.click(screen.getByRole("button", { name: "Amount" }));
    expect(
      screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => row.dataset.testid)
    ).toEqual(["row-b", "row-a"]);
    expect(screen.getByRole("checkbox", { name: "Select a" })).toBe(selectA);
    expect(selectA).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Amount" }));
    expect(
      screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => row.dataset.testid)
    ).toEqual(["row-a", "row-b"]);
    await user.click(screen.getByRole("button", { name: "Amount" }));
    expect(
      screen.getByRole("columnheader", { name: "Amount" })
    ).toHaveAttribute("aria-sort", "none");
    expect(selectA).toBeChecked();
  });

  it("cycles with mouse, Enter and Space, announces direction, and never submits a form", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    function SortableHeader() {
      const [direction, setDirection] = React.useState<"asc" | "desc" | null>(
        null
      );
      return (
        <form onSubmit={onSubmit}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  sortDirection={direction}
                  onSortChange={(next) => {
                    setDirection(next);
                    onSortChange(next);
                  }}
                >
                  Contacts
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </form>
      );
    }
    render(<SortableHeader />);
    const button = screen.getByRole("button", { name: "Contacts" });
    expect(button).toHaveAccessibleDescription(
      "Not sorted. Activate to sort ascending."
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute("scope", "col");
    await user.click(button);
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    await user.keyboard("{Enter}");
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(button).toHaveAccessibleDescription(
      "Sorted descending. Activate to restore the original order."
    );
    await user.keyboard(" ");
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "none"
    );
    expect(onSortChange.mock.calls.map(([next]) => next)).toEqual([
      "asc",
      "desc",
      null,
    ]);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("lets the native header click handler prevent sorting, including clicks on the icon", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={onClick} onSortChange={onSortChange}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    await user.click(screen.getByRole("button").querySelector("svg")!);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it("calls the host click handler before committing an uncancelled sort", async () => {
    const calls: string[] = [];
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => calls.push("host")}
              onSortChange={() => calls.push("sort")}
            >
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    await userEvent.setup().click(screen.getByRole("button"));
    expect(calls).toEqual(["host", "sort"]);
  });

  it("preserves composed custom header buttons and the table-cell ref", async () => {
    const onClick = vi.fn();
    const ref = React.createRef<HTMLTableCellElement>();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              ref={ref}
              sortable
              sortDirection="asc"
              data-column="name"
            >
              <button onClick={onClick}>Custom sort</button>
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(ref.current).toBe(screen.getByRole("columnheader"));
    expect(ref.current).toHaveAttribute("data-column", "name");
  });

  it("does not sort when the control is disabled", async () => {
    const onSortChange = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDisabled onSortChange={onSortChange}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.setup().click(button);
    expect(onSortChange).not.toHaveBeenCalled();
    expect(button).not.toHaveAttribute("sortdisabled");
  });

  it("moves between enabled sort controls with arrows and Home/End", async () => {
    const user = userEvent.setup();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onSortChange={vi.fn()}>Name</TableHead>
            <TableHead onSortChange={vi.fn()} sortDisabled>
              Status
            </TableHead>
            <TableHead onSortChange={vi.fn()}>Contacts</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const name = screen.getByRole("button", { name: "Name" });
    const contacts = screen.getByRole("button", { name: "Contacts" });
    name.focus();
    await user.keyboard("{ArrowRight}");
    expect(contacts).toHaveFocus();
    await user.keyboard("{Home}");
    expect(name).toHaveFocus();
    await user.keyboard("{End}");
    expect(contacts).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(name).toHaveFocus();
  });

  it("honors native key-handler cancellation and custom accessible labels", async () => {
    const user = userEvent.setup();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onSortChange={vi.fn()}
              sortLabel="Sort campaigns"
              onKeyDown={(event) => event.preventDefault()}
            >
              <span>Campaign</span>
              <small>Names</small>
            </TableHead>
            <TableHead onSortChange={vi.fn()}>Contacts</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const button = screen.getByRole("button", { name: "Sort campaigns" });
    button.focus();
    await user.keyboard("{ArrowRight}");
    expect(button).toHaveFocus();
  });
});

describe("Table native behavior and loading", () => {
  it("keeps children, styles and native drag / animation / click events on a row", () => {
    const onDrag = vi.fn();
    const onAnimationStart = vi.fn();
    const onClick = vi.fn();
    render(
      <Table>
        <TableBody>
          <TableRow
            draggable
            onDrag={onDrag}
            onAnimationStart={onAnimationStart}
            onClick={onClick}
            style={{ opacity: 0.7 }}
            data-row-id="campaign"
          >
            <TableCell colSpan={2}>Campaign</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = screen.getByRole("row");
    fireEvent.drag(row);
    fireEvent.animationStart(row);
    fireEvent.click(row);
    expect(onDrag).toHaveBeenCalledOnce();
    expect(onAnimationStart).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
    expect(row).toHaveStyle({ opacity: 0.7 });
    expect(row).toHaveAttribute("data-row-id", "campaign");
    expect(screen.getByRole("cell")).toHaveAttribute("colspan", "2");
  });

  it("marks the loading body busy but preserves an explicit host override", () => {
    const { rerender } = render(
      <Table>
        <TableBody isLoading data-testid="body" />
      </Table>
    );
    expect(screen.getByTestId("body")).toHaveAttribute("aria-busy", "true");
    rerender(
      <Table>
        <TableBody isLoading aria-busy={false} data-testid="body" />
      </Table>
    );
    expect(screen.getByTestId("body")).toHaveAttribute("aria-busy", "false");
  });

  it("preserves intentional falsy empty-state content", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={1}>{0}</TableEmpty>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("cell")).toHaveTextContent("0");
    expect(screen.queryByText("No data available")).not.toBeInTheDocument();
  });
});

describe("TableBody opt-in row motion", () => {
  const animate = vi.fn();
  const cancel = vi.fn();
  const originalAnimate = Object.getOwnPropertyDescriptor(
    HTMLTableRowElement.prototype,
    "animate"
  );
  beforeEach(() => {
    animate.mockReset().mockReturnValue({ cancel });
    cancel.mockReset();
    Object.defineProperty(HTMLTableRowElement.prototype, "animate", {
      configurable: true,
      value: animate,
    });
    vi.spyOn(
      HTMLTableRowElement.prototype,
      "getBoundingClientRect"
    ).mockImplementation(function (this: HTMLTableRowElement) {
      return new DOMRect(0, this.sectionRowIndex * 160, 600, 40);
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    if (originalAnimate)
      Object.defineProperty(
        HTMLTableRowElement.prototype,
        "animate",
        originalAnimate
      );
    else
      delete (HTMLTableRowElement.prototype as Partial<HTMLTableRowElement>)
        .animate;
  });
  const table = (
    order: string[],
    animateRows?: boolean,
    ref?: React.Ref<HTMLTableSectionElement>
  ) => (
    <Table>
      <TableBody animateRows={animateRows} ref={ref}>
        {order.map((id) => (
          <TableRow key={id}>
            <TableCell>{id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  it("keeps reordering instant by default", () => {
    const { rerender } = render(table(["a", "b"]));
    rerender(table(["b", "a"]));
    expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(
      ["b", "a"]
    );
    expect(animate).not.toHaveBeenCalled();
  });

  it("animates existing native rows with bounded travel, cancels rapid sorts and forwards the body ref", () => {
    const ref = React.createRef<HTMLTableSectionElement>();
    const { rerender, unmount } = render(table(["a", "b"], true, ref));
    const a = screen.getByText("a").closest("tr");
    expect(animate).not.toHaveBeenCalled();
    rerender(table(["b", "a"], true, ref));
    expect(screen.getByText("a").closest("tr")).toBe(a);
    expect(animate).toHaveBeenCalledTimes(2);
    expect(animate.mock.calls[0][0][0].transform).toContain("80px");
    expect(animate.mock.calls[1][0][0].transform).toContain("-80px");
    expect(animate.mock.calls[0][1]).toEqual({
      duration: 240,
      easing: "cubic-bezier(0.22,1,0.36,1)",
    });
    expect(ref.current?.tagName).toBe("TBODY");
    expect(ref.current?.rows).toHaveLength(2);
    rerender(table(["a", "b"], true, ref));
    expect(cancel).toHaveBeenCalledTimes(2);
    unmount();
    expect(cancel).toHaveBeenCalledTimes(4);
    expect(ref.current).toBeNull();
  });

  it("honors reduced motion while sorting the real rows", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
        }) as MediaQueryList
    );
    const { rerender } = render(table(["a", "b"], true));
    rerender(table(["b", "a"], true));
    expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(
      ["b", "a"]
    );
    expect(animate).not.toHaveBeenCalled();
  });

  it("does not animate newly added rows", () => {
    const { rerender } = render(table(["a"], true));
    rerender(table(["a", "b"], true));
    expect(animate).not.toHaveBeenCalled();
  });
});

it("preserves cleanup-returning callback refs", () => {
  const calls: string[] = [];
  const ref = (node: HTMLTableSectionElement | null) => {
    calls.push(node ? "attach" : "null");
    if (node)
      return () => {
        calls.push("cleanup");
      };
  };
  const { unmount } = render(
    <Table>
      <TableBody ref={ref}>
        <TableRow>
          <TableCell>Campaign</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
  unmount();
  expect(calls).toEqual(["attach", "cleanup"]);
});
