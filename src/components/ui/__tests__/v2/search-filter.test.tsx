import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Placement } from "@floating-ui/react-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchFilter, type SearchFilterOption } from "../../v2/search-filter";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

// jsdom has no layout, so floating-ui never flips. Let a test force the placement
// the hook reports; everything else passes straight through to the real hook.
const forced = vi.hoisted(() => ({ placement: null as string | null }));
vi.mock("@floating-ui/react-dom", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@floating-ui/react-dom")>();
  return {
    ...actual,
    useFloating: (options: Parameters<typeof actual.useFloating>[0]) => {
      const result = actual.useFloating(options);
      return forced.placement
        ? { ...result, placement: forced.placement as Placement }
        : result;
    },
  };
});

const options: SearchFilterOption[] = [
  { value: "3001", label: "+91 11 4000 3001" },
  { value: "3453", label: "+91 11 4000 3453" },
  { value: "5444", label: "+91 11 4000 5444" },
];

describe("SearchFilter", () => {
  it("renders single-select options after opening", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(
      screen.getByRole("option", { name: "+91 11 4000 3001" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Apply" })
    ).not.toBeInTheDocument();
  });

  it("applies default size classes", () => {
    render(<SearchFilter options={options} data-testid="search-filter" />);

    expect(screen.getByTestId("search-filter")).toHaveClass("w-full");
    expect(screen.getByTestId("search-filter")).toHaveClass("max-w-[360px]");
    expect(screen.getByTestId("search-filter")).toHaveClass("relative");
  });

  it.each([
    ["sm", "max-w-80"],
    ["default", "max-w-[360px]"],
    ["lg", "max-w-[420px]"],
  ] as const)("renders %s size", (size, maxWidthClass) => {
    render(
      <SearchFilter size={size} options={options} data-testid="search-filter" />
    );

    expect(screen.getByTestId("search-filter")).toHaveClass("w-full");
    expect(screen.getByTestId("search-filter")).toHaveClass(maxWidthClass);
  });

  it("applies custom className", () => {
    render(
      <SearchFilter
        className="custom-class"
        options={options}
        data-testid="search-filter"
      />
    );

    expect(screen.getByTestId("search-filter")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<SearchFilter ref={ref} options={options} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props", () => {
    render(
      <SearchFilter
        options={options}
        data-testid="search-filter"
        aria-label="Number filter"
      />
    );

    expect(screen.getByTestId("search-filter")).toHaveAttribute(
      "aria-label",
      "Number filter"
    );
  });

  it("selects a single option and shows it in the search input", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} searchMode="text" />);

    await user.click(screen.getByPlaceholderText("Search..."));

    await user.click(screen.getByRole("option", { name: "+91 11 4000 3001" }));

    expect(screen.getByPlaceholderText("Search...")).toHaveValue(
      "+91 11 4000 3001"
    );
    expect(
      screen.queryByRole("option", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("stays closed when a queued refocus frame fires after selection", async () => {
    // Hold every animation frame so the refocus is GUARANTEED to still be
    // pending when the option is clicked. Left to real timing the frame
    // usually lands first and the bug hides, which is exactly why it survived.
    const frames: Array<FrameRequestCallback | null> = [];
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => frames.push(cb));
    const cancelSpy = vi
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation((handle: number) => {
        frames[handle - 1] = null;
      });

    try {
      const user = userEvent.setup();

      render(<SearchFilter options={options} searchMode="text" />);

      const input = screen.getByPlaceholderText("Search...");
      await user.click(input);
      await user.click(
        screen.getByRole("option", { name: "+91 11 4000 3001" })
      );

      // Without the cancel, this frame refocuses the input, whose onFocus
      // reopens the dropdown that selectOption just closed.
      await act(async () => {
        frames.splice(0).forEach((cb) => cb?.(0));
      });

      expect(screen.queryAllByRole("option")).toHaveLength(0);
      expect(input).toHaveAttribute("aria-expanded", "false");
    } finally {
      rafSpy.mockRestore();
      cancelSpy.mockRestore();
    }
  });

  it("calls selection callbacks with the chosen option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onOptionSelect = vi.fn();

    render(
      <SearchFilter
        options={options}
        onValueChange={onValueChange}
        onOptionSelect={onOptionSelect}
      />
    );

    await user.click(screen.getByPlaceholderText("Search..."));
    await user.click(screen.getByRole("option", { name: "+91 11 4000 3001" }));

    expect(onValueChange).toHaveBeenCalledWith("3001");
    expect(onOptionSelect).toHaveBeenCalledWith(options[0]);
  });

  it("filters options by search text", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    await user.type(screen.getByPlaceholderText("Search..."), "3453");

    expect(
      screen.getByRole("option", { name: "+91 11 4000 3453" })
    ).toBeInTheDocument();
    expect(screen.getByText("3453")).toHaveClass("font-semibold");
    expect(
      screen.queryByRole("option", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("skips internal filtering while query is shorter than minSearchLength", async () => {
    const user = userEvent.setup();

    render(
      <SearchFilter
        options={[...options, { value: "sales", label: "Sales Team" }]}
        searchMode="text"
        minSearchLength={3}
      />
    );

    await user.type(screen.getByPlaceholderText("Search..."), "sa");

    // Below the threshold: non-matching options remain visible, no filtering.
    expect(
      screen.getByRole("option", { name: "Sales Team" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "+91 11 4000 3001" })
    ).toBeInTheDocument();
  });

  it("filters once the query reaches minSearchLength", async () => {
    const user = userEvent.setup();

    render(
      <SearchFilter
        options={[...options, { value: "sales", label: "Sales Team" }]}
        searchMode="text"
        minSearchLength={3}
      />
    );

    await user.type(screen.getByPlaceholderText("Search..."), "sal");

    expect(
      screen.getByRole("option", { name: "Sales Team" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("defaults to numeric search with digits only", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(<SearchFilter options={options} onSearchChange={onSearchChange} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "abc3453");

    expect(searchInput).toHaveValue("3453");
    expect(onSearchChange).toHaveBeenLastCalledWith("3453");
    expect(
      screen.getByRole("option", { name: "+91 11 4000 3453" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("supports character search text when searchMode is text", async () => {
    const user = userEvent.setup();

    render(
      <SearchFilter
        options={[...options, { value: "sales", label: "Sales Team" }]}
        searchMode="text"
      />
    );

    await user.type(screen.getByPlaceholderText("Search..."), "sales");

    expect(
      screen.getByRole("option", { name: "Sales Team" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("supports controlled search text", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} searchValue="5444" />);

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(
      screen.getByRole("option", { name: "+91 11 4000 5444" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("clears search text with the clear button", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(<SearchFilter options={options} onSearchChange={onSearchChange} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(
      screen.queryByRole("button", { name: "Clear search" })
    ).not.toBeInTheDocument();

    await user.type(searchInput, "3453");

    expect(searchInput).toHaveValue("3453");
    expect(
      screen.getByRole("button", { name: "Clear search" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(searchInput).toHaveValue("");
    expect(onSearchChange).toHaveBeenLastCalledWith("");
    expect(
      screen.getByRole("option", { name: "+91 11 4000 3001" })
    ).toBeInTheDocument();
  });

  it("marks the controlled value as selected", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} value="3453" />);

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(
      screen.getByRole("option", { name: "+91 11 4000 3453" })
    ).toHaveAttribute("aria-selected", "true");
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SearchFilter
        options={[{ ...options[0], disabled: true }, ...options.slice(1)]}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByPlaceholderText("Search..."));
    await user.click(screen.getByRole("option", { name: "+91 11 4000 3001" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText("Search...")).toHaveValue("");
  });

  it("has Bootstrap margin reset on all paragraph elements", () => {
    const { container } = render(<SearchFilter options={options} />);

    assertNoBootstrapMarginBleed(container);
  });

  it("opens the dropdown when the search input is clicked", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    expect(
      screen.queryByRole("option", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(
      screen.getByRole("option", { name: "+91 11 4000 3001" })
    ).toBeInTheDocument();
  });

  it("does not render a second search input inside the dropdown", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(screen.getAllByPlaceholderText("Search...")).toHaveLength(1);
  });
});

describe("SearchFilter v2 refresh", () => {
  beforeEach(() => {
    forced.placement = null;
  });

  it("keeps the field in its open look while the list is open", async () => {
    const user = userEvent.setup();
    render(<SearchFilter options={options} />);
    const input = screen.getByRole("searchbox");

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input.className).toContain(
      "aria-expanded:border-[var(--color-secondary-600,#27ABB8)]"
    );
    expect(input.className).toContain(
      "aria-expanded:shadow-[0_0_4px_0_rgba(39,171,184,0.4)]"
    );
    expect(input.className).toContain(
      "enabled:aria-expanded:hover:border-[var(--color-secondary-600,#27ABB8)]"
    );

    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps a caller className on the input next to the open look", () => {
    render(
      <SearchFilter options={options} inputProps={{ className: "custom-x" }} />
    );
    const input = screen.getByRole("searchbox");
    expect(input).toHaveClass("custom-x", "pl-10", "pr-9");
  });

  it("gives rows a 4px radius and a keyboard-only ring", async () => {
    const user = userEvent.setup();
    render(<SearchFilter options={options} />);
    await user.click(screen.getByRole("searchbox"));
    const row = screen.getByRole("option", { name: "+91 11 4000 3001" });
    expect(row).toHaveClass(
      "rounded-sm",
      "focus-visible:ring-1",
      "focus-visible:ring-inset",
      "focus-visible:ring-semantic-border-accent",
      "hover:bg-semantic-bg-ui"
    );
  });

  it("pops the selected check in without a transform that the keyframe would override", async () => {
    const user = userEvent.setup();
    render(<SearchFilter options={options} defaultValue="3453" />);
    await user.click(screen.getByRole("searchbox"));
    const check = screen
      .getByRole("option", { name: "+91 11 4000 3453" })
      .querySelector("svg");
    expect(check).toHaveClass(
      "motion-safe:animate-in",
      "motion-safe:fade-in-0",
      "motion-safe:zoom-in-[0.85]",
      "motion-safe:[animation-duration:180ms]",
      "inset-y-0",
      "my-auto"
    );
    // `-translate-y-1/2` would be replaced by the keyframe's transform and shove it down.
    expect(check).not.toHaveClass("-translate-y-1/2");
  });

  it("grows the panel from the top-left and slides down when it opens below", async () => {
    const user = userEvent.setup();
    render(<SearchFilter options={options} />);
    await user.click(screen.getByRole("searchbox"));
    const panel = screen.getByRole("listbox").parentElement as HTMLElement;

    expect(panel).toHaveAttribute("data-side", "bottom");
    expect(panel).toHaveAttribute("data-align", "start");
    expect(panel.style.transformOrigin).toBe("top left");
    expect(panel).toHaveClass("data-[side=bottom]:slide-in-from-top-1");
    expect(panel).not.toHaveClass("origin-top-left");
    // fade/zoom must be motion-safe too: a bare `fade-in-0` is overridden by the
    // motion-safe `animate-in` reset (--tw-enter-* back to initial) and does nothing.
    expect(panel).toHaveClass(
      "motion-safe:animate-in",
      "motion-safe:fade-in-0",
      "motion-safe:zoom-in-[0.98]"
    );
    expect(panel).not.toHaveClass("fade-in-0");
    expect(panel).not.toHaveClass("zoom-in-[0.98]");
  });

  it.each([
    ["top-start", "top", "start", "bottom left"],
    ["top-end", "top", "end", "bottom right"],
    ["bottom-end", "bottom", "end", "top right"],
  ])(
    "derives the panel origin from the placement actually used (%s)",
    async (placement, side, align, origin) => {
      forced.placement = placement;
      const user = userEvent.setup();
      render(<SearchFilter options={options} />);
      await user.click(screen.getByRole("searchbox"));
      const panel = screen.getByRole("listbox").parentElement as HTMLElement;

      expect(panel).toHaveAttribute("data-side", side);
      expect(panel).toHaveAttribute("data-align", align);
      expect(panel.style.transformOrigin).toBe(origin);
      expect(panel).toHaveClass("data-[side=top]:slide-in-from-bottom-1");
    }
  );
});
