import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchFilter, type SearchFilterOption } from "../search-filter";
import { assertNoBootstrapMarginBleed } from "./utils/bootstrap-compat";

const options: SearchFilterOption[] = [
  { value: "3001", label: "+91 11 4000 3001" },
  { value: "3453", label: "+91 11 4000 3453" },
  { value: "5444", label: "+91 11 4000 5444" },
];

describe("SearchFilter", () => {
  it("renders options and action buttons after opening", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(screen.getByRole("checkbox", { name: "+91 11 4000 3001" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
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
      <SearchFilter
        size={size}
        options={options}
        data-testid="search-filter"
      />
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

  it("updates internal selected values", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    await user.click(screen.getByPlaceholderText("Search..."));

    await user.click(screen.getByRole("checkbox", { name: "+91 11 4000 3001" }));

    expect(
      screen.getByRole("checkbox", { name: "+91 11 4000 3001" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("calls onApply with the current selected values", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(
      <SearchFilter
        options={options}
        onApply={onApply}
      />
    );

    await user.click(screen.getByPlaceholderText("Search..."));
    await user.click(screen.getByRole("checkbox", { name: "+91 11 4000 3001" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onApply).toHaveBeenCalledWith(["3001"]);
  });

  it("filters options by search text", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    await user.type(screen.getByPlaceholderText("Search..."), "3453");

    expect(screen.getByRole("checkbox", { name: "+91 11 4000 3453" })).toBeInTheDocument();
    expect(screen.getByText("3453")).toHaveClass("font-semibold");
    expect(
      screen.queryByRole("checkbox", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("defaults to numeric search with digits only", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <SearchFilter
        options={options}
        onSearchChange={onSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "abc3453");

    expect(searchInput).toHaveValue("3453");
    expect(onSearchChange).toHaveBeenLastCalledWith("3453");
    expect(screen.getByRole("checkbox", { name: "+91 11 4000 3453" })).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "+91 11 4000 3001" })
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

    expect(screen.getByRole("checkbox", { name: "Sales Team" })).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("supports controlled search text", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} searchValue="5444" />);

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(screen.getByRole("checkbox", { name: "+91 11 4000 5444" })).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();
  });

  it("clears search text with the clear button", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(<SearchFilter options={options} onSearchChange={onSearchChange} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();

    await user.type(searchInput, "3453");

    expect(searchInput).toHaveValue("3453");
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(searchInput).toHaveValue("");
    expect(onSearchChange).toHaveBeenLastCalledWith("");
    expect(screen.getByRole("checkbox", { name: "+91 11 4000 3001" })).toBeInTheDocument();
  });

  it("disables cancel and apply buttons separately", async () => {
    const user = userEvent.setup();

    render(
      <SearchFilter
        options={options}
        cancelDisabled
        applyDisabled={false}
      />
    );

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Apply" })).not.toBeDisabled();
  });

  it("disables apply button separately", async () => {
    const user = userEvent.setup();

    render(
      <SearchFilter
        options={options}
        cancelDisabled={false}
        applyDisabled
      />
    );

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  it("has Bootstrap margin reset on all paragraph elements", () => {
    const { container } = render(<SearchFilter options={options} />);

    assertNoBootstrapMarginBleed(container);
  });

  it("opens the dropdown when the search input is clicked", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    expect(
      screen.queryByRole("checkbox", { name: "+91 11 4000 3001" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(screen.getByRole("checkbox", { name: "+91 11 4000 3001" })).toBeInTheDocument();
  });

  it("does not render a second search input inside the dropdown", async () => {
    const user = userEvent.setup();

    render(<SearchFilter options={options} />);

    await user.click(screen.getByPlaceholderText("Search..."));

    expect(screen.getAllByPlaceholderText("Search...")).toHaveLength(1);
  });
});
