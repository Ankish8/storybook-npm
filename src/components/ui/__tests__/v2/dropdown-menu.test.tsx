import { describe, it, expect, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createRef } from "react";
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
} from "../../v2/dropdown-menu";

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

describe("DropdownMenu focus return", () => {
  const renderMenu = (onCloseAutoFocus?: (e: Event) => void) =>
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={onCloseAutoFocus}>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  it("does not give focus back to the trigger after a mouse pick (no keyboard ring)", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByText("Open Menu"));
    await user.click(screen.getByText("Item 1"));
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.getByText("Open Menu")).not.toHaveFocus();
  });

  it("gives focus back to the trigger when the keyboard closes it", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByText("Open Menu"));
    await user.keyboard("{ArrowDown}{Escape}");
    expect(screen.getByText("Open Menu")).toHaveFocus();
  });

  it("still calls a consumer onCloseAutoFocus", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    renderMenu(spy);
    await user.click(screen.getByText("Open Menu"));
    await user.click(screen.getByText("Item 1"));
    expect(spy).toHaveBeenCalled();
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

  it("wraps long item labels inside the menu width", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem data-testid="long-item">
            Profile ProfileProfile ProfileProfile ProfileProfile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const text = screen.getByTestId("long-item").querySelector("span");
    expect(text).toHaveClass("min-w-0");
    expect(text).toHaveClass("whitespace-normal");
    expect(text).toHaveClass("break-words");
  });

  it("keeps icons inline with short labels", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem data-testid="icon-item">
            <svg data-testid="item-icon" />
            Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const item = screen.getByTestId("icon-item");
    expect(item).toHaveClass("items-center");
    expect(screen.getByTestId("item-icon").parentElement).toBe(item);
    expect(screen.getByText("Profile")).toHaveClass("break-words");
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
      "text-[var(--v2-text-muted,#707070)]"
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
    expect(shortcut).toHaveClass("border-semantic-border-layout");
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
    expect(content).toHaveClass(
      "max-h-[min(20rem,var(--radix-dropdown-menu-content-available-height))]"
    );
    expect(content).toHaveClass(
      "max-w-[min(20rem,var(--radix-dropdown-menu-content-available-width))]"
    );
    expect(content).toHaveClass("overflow-x-hidden");
    expect(content).toHaveClass("overflow-y-auto");
    expect(content).toHaveClass("overscroll-contain");
    expect(content).toHaveClass("rounded-lg");
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

describe("v2 asChild composition", () => {
  it("preserves an anchor, its ref and onSelect without adding a second Slot child", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open links</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild ref={ref} onSelect={onSelect}>
            <a href="#conversation-details" data-testid="details-link">
              Conversation details
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open links" }));
    const item = screen.getByRole("menuitem", { name: "Conversation details" });
    expect(item.tagName).toBe("A");
    expect(item).toHaveAttribute("href", "#conversation-details");
    expect(ref.current).toBe(item);
    await user.click(item);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("keeps an asChild link's description and suffix inside that link", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open descriptions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            asChild
            description="Review workspace activity"
            suffix="⌘A"
          >
            <a href="#activity">Activity</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open descriptions" }));
    const item = screen.getByRole("menuitem");
    expect(item.tagName).toBe("A");
    expect(item).toHaveTextContent("Activity");
    expect(item).toHaveTextContent("Review workspace activity");
    expect(item).toHaveTextContent("⌘A");
  });

  it("supports an asChild checkbox and calls its selection handler", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open preferences</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            asChild
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            <button type="button">Show resolved</button>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open preferences" }));
    await user.click(
      screen.getByRole("menuitemcheckbox", { name: "Show resolved" })
    );
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports an asChild radio selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open sorting</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="newest" onValueChange={onValueChange}>
            <DropdownMenuRadioItem asChild value="oldest">
              <button type="button">Oldest first</button>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open sorting" }));
    await user.click(
      screen.getByRole("menuitemradio", { name: "Oldest first" })
    );
    expect(onValueChange).toHaveBeenCalledWith("oldest");
  });

  it("supports an asChild submenu trigger with its chevron and keyboard opening", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open more</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger asChild>
              <button type="button">More options</button>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Export conversations</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open more" }));
    const trigger = screen.getByRole("menuitem", { name: "More options" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.querySelector("svg")).toBeInTheDocument();
    act(() => trigger.focus());
    await user.keyboard("{ArrowRight}");
    expect(
      await screen.findByRole("menuitem", { name: "Export conversations" })
    ).toBeInTheDocument();
  });
});

describe("DropdownMenu v2 refresh", () => {
  const openMenu = async (menu: React.ReactNode) => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>{menu}</DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    return user;
  };

  it("styles a destructive item with the error text token and an error-tinted highlight", async () => {
    await openMenu(
      <>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem destructive>Delete</DropdownMenuItem>
      </>
    );
    const del = screen.getByRole("menuitem", { name: "Delete" });
    expect(del).toHaveClass(
      "text-semantic-error-text",
      "focus:bg-semantic-error-surface",
      "focus:text-semantic-error-text"
    );
    expect(del).toHaveAttribute("data-destructive", "");
    // The tint is an explicit token, never a slash-alpha modifier (compiles to nothing on var()).
    expect(del.className).not.toMatch(/error[^ ]*\/\d/);
    // `destructive` is consumed, not leaked to the DOM as an unknown attribute.
    expect(del).not.toHaveAttribute("destructive");
  });

  it("leaves a default item unchanged: no destructive classes or hook", async () => {
    await openMenu(<DropdownMenuItem>Edit</DropdownMenuItem>);
    const edit = screen.getByRole("menuitem", { name: "Edit" });
    expect(edit).not.toHaveAttribute("data-destructive");
    expect(edit.className).not.toContain("semantic-error");
    expect(edit).toHaveClass(
      "focus:bg-semantic-bg-ui",
      "focus:text-[var(--v2-text-primary,#484848)]"
    );
  });

  it("keeps a destructive item selectable and disabled-aware", async () => {
    const onSelect = vi.fn();
    const user = await openMenu(
      <>
        <DropdownMenuItem destructive onSelect={onSelect}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem destructive disabled>
          Purge
        </DropdownMenuItem>
      </>
    );
    expect(screen.getByRole("menuitem", { name: "Purge" })).toHaveAttribute(
      "data-disabled"
    );
    // Disabled text still wins (data-[disabled]: has higher specificity than the base colour).
    expect(screen.getByRole("menuitem", { name: "Purge" })).toHaveClass(
      "data-[disabled]:text-semantic-disabled-primary"
    );
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("passes destructive through asChild onto the real element", async () => {
    await openMenu(
      <DropdownMenuItem asChild destructive>
        <a href="#remove">Remove</a>
      </DropdownMenuItem>
    );
    const link = screen.getByRole("menuitem", { name: "Remove" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("data-destructive", "");
    expect(link).toHaveClass("text-semantic-error-text");
  });

  it("gives every row type a 4px radius concentric with the 8px menu", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Plain</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Check</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Radio</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Inner</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    for (const row of [
      screen.getByRole("menuitem", { name: "Plain" }),
      screen.getByRole("menuitemcheckbox", { name: "Check" }),
      screen.getByRole("menuitemradio", { name: "Radio" }),
      screen.getByRole("menuitem", { name: "More" }),
    ]) {
      expect(row).toHaveClass("rounded-sm");
      expect(row).not.toHaveClass("rounded-none");
      // Row height and padding are untouched: 48px rows.
      expect(row).toHaveClass("min-h-9");
    }
  });

  it("has no keyboard-only ring: Radix focuses hovered rows too, so focus-visible cannot tell them apart", async () => {
    await openMenu(<DropdownMenuItem>Plain</DropdownMenuItem>);
    expect(
      screen.getByRole("menuitem", { name: "Plain" }).className
    ).not.toContain("focus-visible:ring");
  });

  it("pops the check in on checked checkbox and radio rows", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Check</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Radio</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    for (const row of [
      screen.getByRole("menuitemcheckbox", { name: "Check" }),
      screen.getByRole("menuitemradio", { name: "Radio" }),
    ]) {
      expect(row.querySelector("svg")).toHaveClass(
        "motion-safe:animate-in",
        "motion-safe:fade-in-0",
        "motion-safe:zoom-in-[0.85]",
        "motion-safe:[animation-duration:180ms]"
      );
    }
  });

  it("grows from the trigger edge: spring transform plus quick fade open, small fast close, motion-safe only", async () => {
    await openMenu(<DropdownMenuItem>Edit</DropdownMenuItem>);
    const menu = screen.getByRole("menu");
    expect(menu).toHaveClass(
      "data-[state=open]:motion-safe:animate-in",
      "data-[state=open]:motion-safe:zoom-in-[0.97]",
      "data-[state=open]:motion-safe:[animation-duration:580ms,160ms]",
      "data-[state=closed]:motion-safe:animate-out",
      "data-[state=closed]:motion-safe:fade-out-0",
      "data-[state=closed]:motion-safe:zoom-out-[0.985]",
      "data-[state=closed]:motion-safe:[animation-duration:130ms]",
      "data-[side=bottom]:motion-safe:slide-in-from-top-[5px]",
      "data-[side=top]:motion-safe:slide-in-from-bottom-[5px]"
    );
    // Reduced motion keeps only a short fade.
    expect(menu).toHaveClass(
      "motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out]"
    );
    expect(menu).not.toHaveClass("data-[state=open]:fade-in-0");
    expect(menu).not.toHaveClass("data-[side=bottom]:slide-in-from-top-1");
  });

  it("uses the Arc surface: 5px inset, 12rem minimum and floating shadow", async () => {
    await openMenu(<DropdownMenuItem>Edit</DropdownMenuItem>);
    const menu = screen.getByRole("menu");
    expect(menu).toHaveClass(
      "p-[5px]",
      "min-w-[min(12rem,var(--radix-dropdown-menu-content-available-width))]",
      "shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)]"
    );
  });

  it("moves one aria-hidden highlight to the focused row instead of tinting each row", async () => {
    await openMenu(
      <>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem destructive>Delete</DropdownMenuItem>
      </>
    );
    const menu = screen.getByRole("menu");
    const highlight = menu.querySelector("[data-menu-highlight]");
    expect(highlight).toHaveAttribute("aria-hidden", "true");
    // Rows give up their own focus tint while the menu owns the highlight.
    expect(menu).toHaveClass("[&_[role^=menuitem]:focus]:bg-transparent");
    expect(highlight).not.toHaveAttribute("data-tone");
    fireEvent.focus(screen.getByRole("menuitem", { name: "Delete" }));
    await waitFor(() =>
      expect(menu.querySelector("[data-menu-highlight]")).toHaveAttribute(
        "data-tone",
        "danger"
      )
    );
  });

  it("keeps the group label on the recorded 14px / 500 / primary text role", async () => {
    await openMenu(
      <>
        <DropdownMenuLabel>Conversation</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </>
    );
    // design/V2-TEXT-HIERARCHY-OVERLAYS-REVIEW.md records the section label as #484848 / 500,
    // so it is deliberately NOT unified with SelectLabel (12px muted).
    expect(screen.getByText("Conversation")).toHaveClass(
      "text-sm",
      "font-medium",
      "text-[var(--v2-text-primary,#484848)]"
    );
  });
});
