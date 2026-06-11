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
