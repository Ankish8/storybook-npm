import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
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
