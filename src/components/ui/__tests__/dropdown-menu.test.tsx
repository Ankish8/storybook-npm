import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../dropdown-menu";

describe("DropdownMenu", () => {
  it("renders trigger button", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Open Menu")).toBeInTheDocument();
  });

  it("opens menu on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open Menu"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("closes menu when pressing Escape", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button>Outside</button>
      </div>
    );

    await user.click(screen.getByText("Open Menu"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });
});

describe("DropdownMenuItem", () => {
  it("renders menu item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menuitem")).toHaveTextContent("Action Item");
  });

  it("handles click on menu item", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleClick}>Click Me</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders disabled menu item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menuitem")).toHaveAttribute("data-disabled");
  });

  it("renders inset menu item with extra padding", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset data-testid="inset-item">
            Inset Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("inset-item")).toHaveClass("pl-8");
  });
});

describe("DropdownMenuItem description and suffix", () => {
  it("renders description text below children", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem description="Secondary text">
            Primary text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Primary text")).toBeInTheDocument();
    expect(screen.getByText("Secondary text")).toBeInTheDocument();
    expect(screen.getByText("Secondary text")).toHaveClass(
      "text-xs",
      "text-semantic-text-muted"
    );
  });

  it("renders suffix at the right edge", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem suffix="MY01">Channel Name</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("MY01")).toBeInTheDocument();
    expect(screen.getByText("MY01")).toHaveClass("ml-auto", "text-xs");
  });

  it("renders both description and suffix together", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem description="+91 9876543210" suffix="WA01">
            MyOperator Sales
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("MyOperator Sales")).toBeInTheDocument();
    expect(screen.getByText("+91 9876543210")).toBeInTheDocument();
    expect(screen.getByText("WA01")).toBeInTheDocument();
  });

  it("renders without description or suffix (backward compatible)", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Simple Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menuitem")).toHaveTextContent("Simple Item");
  });
});

describe("DropdownMenuCheckboxItem", () => {
  it("renders checkbox item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={false}>
            Checkbox Option
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menuitemcheckbox")).toBeInTheDocument();
  });

  it("renders checked state", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true}>
            Checked Option
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute(
      "data-state",
      "checked"
    );
  });
});

describe("DropdownMenuRadioGroup", () => {
  it("renders radio group with items", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">
              Option 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">
              Option 2
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const radioItems = screen.getAllByRole("menuitemradio");
    expect(radioItems).toHaveLength(2);
  });

  it("shows selected radio item", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">
              Option 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">
              Option 2
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const radioItems = screen.getAllByRole("menuitemradio");
    expect(radioItems[0]).toHaveAttribute("data-state", "checked");
    expect(radioItems[1]).toHaveAttribute("data-state", "unchecked");
  });
});

describe("DropdownMenuRadioItem description and suffix", () => {
  it("renders description and suffix on radio items", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="ch1">
            <DropdownMenuRadioItem
              value="ch1"
              description="+91 9212992129"
              suffix="MY01"
            >
              MyOperator Sales
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ch2">
              Simple Item
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("MyOperator Sales")).toBeInTheDocument();
    expect(screen.getByText("+91 9212992129")).toBeInTheDocument();
    expect(screen.getByText("MY01")).toBeInTheDocument();
    expect(screen.getByText("Simple Item")).toBeInTheDocument();
  });
});

describe("DropdownMenuLabel", () => {
  it("renders label", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Section Label</DropdownMenuLabel>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Section Label")).toBeInTheDocument();
  });

  it("renders inset label", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset data-testid="label">
            Inset Label
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("label")).toHaveClass("pl-8");
  });
});

describe("DropdownMenuSeparator", () => {
  it("renders separator", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("separator")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toHaveClass("h-px");
    expect(screen.getByTestId("separator")).toHaveClass(
      "bg-semantic-border-layout"
    );
  });
});

describe("DropdownMenuShortcut", () => {
  it("renders keyboard shortcut", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Copy
            <DropdownMenuShortcut>Ctrl+C</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Ctrl+C")).toBeInTheDocument();
  });

  it("has correct styling for shortcut", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Action
            <DropdownMenuShortcut data-testid="shortcut">
              ⌘K
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const shortcut = screen.getByTestId("shortcut");
    expect(shortcut).toHaveClass("ml-auto");
    expect(shortcut).toHaveClass("text-xs");
    expect(shortcut).toHaveClass("opacity-60");
  });
});

describe("DropdownMenuGroup", () => {
  it("renders grouped items", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Group Item 1</DropdownMenuItem>
            <DropdownMenuItem>Group Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Group Item 1")).toBeInTheDocument();
    expect(screen.getByText("Group Item 2")).toBeInTheDocument();
  });
});

describe("DropdownMenuSub", () => {
  it("renders submenu trigger", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("More Options")).toBeInTheDocument();
  });

  it("renders inset submenu trigger", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset data-testid="sub-trigger">
              Inset Sub
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("sub-trigger")).toHaveClass("pl-8");
  });
});

describe("DropdownMenuContent styling", () => {
  it("has correct base classes", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent data-testid="content">
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const content = screen.getByTestId("content");
    expect(content).toHaveClass("z-[9999]");
    expect(content).toHaveClass("rounded-md");
    expect(content).toHaveClass("border");
    expect(content).toHaveClass("bg-semantic-bg-primary");
  });

  it("applies custom className", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-class" data-testid="content">
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("content")).toHaveClass("custom-class");
  });
});

describe("Keyboard navigation", () => {
  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // Open with Enter
    screen.getByText("Open").focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Item 1")).toBeInTheDocument();

    // Navigate with arrow keys
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    // Close with Escape
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });
});
