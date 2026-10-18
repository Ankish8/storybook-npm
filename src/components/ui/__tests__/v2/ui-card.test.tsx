import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiCardFooter,
} from "../../v2/ui-card";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

describe("UiCard compatibility and composition", () => {
  it("keeps passive content out of the tab order", () => {
    render(
      <UiCard data-testid="card">
        <UiCardTitle>Report</UiCardTitle>
        <UiCardDescription>Weekly summary</UiCardDescription>
      </UiCard>
    );
    expect(screen.getByRole("heading", { name: "Report" }).tagName).toBe("H3");
    expect(screen.getByText("Weekly summary").tagName).toBe("P");
    const card = screen.getByTestId("card");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
    expect(card).not.toHaveAttribute("aria-pressed");
    expect(card).not.toHaveAttribute("aria-disabled");
  });

  it("forwards refs and native attributes on every existing slot", () => {
    const cardRef = createRef<HTMLDivElement>();
    const headerRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const contentRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();
    const onFocus = vi.fn();
    render(
      <UiCard
        ref={cardRef}
        role="article"
        aria-labelledby="report-title"
        data-testid="card"
        tabIndex={-1}
        style={{ maxWidth: 400 }}
        className="consumer-card w-full"
        onFocus={onFocus}
      >
        <UiCardHeader ref={headerRef} data-testid="header">
          <UiCardTitle
            ref={titleRef}
            id="report-title"
            className="consumer-title"
          >
            Report
          </UiCardTitle>
          <UiCardDescription ref={descriptionRef} aria-label="Summary">
            Weekly summary
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent ref={contentRef} data-testid="content">
          Details
        </UiCardContent>
        <UiCardFooter ref={footerRef} data-testid="footer">
          Updated today
        </UiCardFooter>
      </UiCard>
    );
    expect(cardRef.current).toBe(
      screen.getByRole("article", { name: "Report" })
    );
    expect(headerRef.current).toBe(screen.getByTestId("header"));
    expect(titleRef.current).toBe(
      screen.getByRole("heading", { name: "Report" })
    );
    expect(descriptionRef.current).toBe(screen.getByLabelText("Summary"));
    expect(contentRef.current).toBe(screen.getByTestId("content"));
    expect(footerRef.current).toBe(screen.getByTestId("footer"));
    expect(cardRef.current).toHaveStyle({ maxWidth: "400px" });
    expect(cardRef.current).toHaveAttribute("tabindex", "-1");
    expect(cardRef.current).toHaveClass("consumer-card", "w-full");
    expect(cardRef.current).not.toHaveClass("w-[300px]");
    expect(titleRef.current).toHaveClass("consumer-title");
    cardRef.current?.focus();
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it.each([
    ["default", "w-[300px]"],
    ["template", "w-[300px]"],
    ["icon", "w-[200px]"],
    ["action", "w-[200px]"],
    ["metrics", "w-[300px]"],
  ] as const)(
    "retains the %s presentation and its existing width",
    (variant, width) => {
      render(
        <UiCard variant={variant} data-testid="card">
          Content
        </UiCard>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass(
        width,
        "max-w-full",
        "min-w-0",
        "p-5",
        "rounded-xl"
      );
      if (variant === "action") expect(card).toHaveClass("border-dashed");
      expect(card).not.toHaveAttribute("role");
    }
  );

  it("keeps default selection controlled by the consumer", () => {
    const onClick = vi.fn();
    const { rerender } = render(<UiCard onClick={onClick}>Workspace</UiCard>);
    const card = screen.getByRole("button", { name: "Workspace" });
    expect(card).toHaveAttribute("aria-pressed", "false");
    expect(card).toHaveAttribute("aria-disabled", "false");
    expect(card).toHaveAttribute("tabindex", "0");
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledOnce();
    expect(card).toHaveAttribute("aria-pressed", "false");
    rerender(
      <UiCard onClick={onClick} selected>
        Workspace
      </UiCard>
    );
    expect(card).toHaveAttribute("aria-pressed", "true");
    expect(card).toHaveClass(
      "border-v2-semantic-border-accent",
      "bg-v2-semantic-brand-surface"
    );
  });

  it("allows native role, tabIndex and ARIA customization", () => {
    render(
      <UiCard onClick={vi.fn()} role="radio" aria-checked="true" tabIndex={-1}>
        Workspace
      </UiCard>
    );
    const card = screen.getByRole("radio", { name: "Workspace" });
    expect(card).toHaveAttribute("aria-checked", "true");
    expect(card).toHaveAttribute("tabindex", "-1");
  });

  it("leaves footer actions independent in a passive card", async () => {
    const action = vi.fn();
    render(
      <UiCard role="article" aria-label="Workspace">
        <UiCardTitle>Workspace</UiCardTitle>
        <UiCardFooter>
          <button type="button" onClick={action}>
            Show routing
          </button>
        </UiCardFooter>
      </UiCard>
    );
    await userEvent.tab();
    const button = screen.getByRole("button", { name: "Show routing" });
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter} ");
    expect(action).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("article")).not.toHaveAttribute("tabindex");
  });

  it("resets paragraph margins for Bootstrap hosts", () => {
    const { container } = render(
      <UiCard>
        <UiCardDescription>Summary</UiCardDescription>
      </UiCard>
    );
    assertNoBootstrapMarginBleed(container);
  });
});

describe("UiCard activation", () => {
  it("activates exactly once for a root click, Enter and Space", async () => {
    const onClick = vi.fn();
    render(<UiCard onClick={onClick}>Workspace</UiCard>);
    const card = screen.getByRole("button", { name: "Workspace" });
    await userEvent.tab();
    expect(card).toHaveFocus();
    await userEvent.click(card);
    await userEvent.keyboard("{Enter} ");
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("preserves the click event for host handlers", () => {
    let clickedElement: HTMLDivElement | undefined;
    let eventType: string | undefined;
    render(
      <UiCard
        onClick={(event) => {
          clickedElement = event.currentTarget;
          eventType = event.type;
        }}
      >
        Workspace
      </UiCard>
    );
    const card = screen.getByRole("button", { name: "Workspace" });
    fireEvent.keyDown(card, { key: "Enter" });
    expect(clickedElement).toBe(card);
    expect(eventType).toBe("click");
  });

  it("ignores unrelated keys", () => {
    const onClick = vi.fn();
    render(<UiCard onClick={onClick}>Workspace</UiCard>);
    for (const key of ["Escape", "ArrowDown", "a", "Tab"]) {
      fireEvent.keyDown(screen.getByRole("button"), { key });
    }
    expect(onClick).not.toHaveBeenCalled();
  });

  it("honors host onKeyDown cancellation", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn((event) => event.preventDefault());
    render(
      <UiCard onClick={onClick} onKeyDown={onKeyDown}>
        Workspace
      </UiCard>
    );
    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    fireEvent.keyDown(card, { key: " " });
    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("honors click cancellation in the capture phase", () => {
    const onClick = vi.fn();
    render(
      <UiCard
        onClick={onClick}
        onClickCapture={(event) => event.preventDefault()}
      >
        Workspace
      </UiCard>
    );
    const card = screen.getByRole("button");
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("still activates from noninteractive content clicks", async () => {
    const onClick = vi.fn();
    render(
      <UiCard onClick={onClick}>
        <UiCardTitle>Workspace</UiCardTitle>
      </UiCard>
    );
    await userEvent.click(screen.getByRole("heading", { name: "Workspace" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps a nested button's click, Enter and Space from activating the card", async () => {
    const onClick = vi.fn();
    const childClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <UiCard
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-label="Workspace card"
      >
        <button type="button" onClick={childClick}>
          Preview
        </button>
      </UiCard>
    );
    const child = screen.getByRole("button", { name: "Preview" });
    await userEvent.click(child);
    await userEvent.keyboard("{Enter} ");
    expect(childClick).toHaveBeenCalledTimes(3);
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });

  it("keeps a nested link's click and Enter from activating the card", async () => {
    const onClick = vi.fn();
    const childClick = vi.fn();
    render(
      <UiCard onClick={onClick}>
        <a href="#workspace" onClick={childClick}>
          View workspace
        </a>
      </UiCard>
    );
    const link = screen.getByRole("link", { name: "View workspace" });
    await userEvent.click(link);
    await userEvent.keyboard("{Enter}");
    expect(childClick).toHaveBeenCalledTimes(2);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps typing and activation keys in a nested input", async () => {
    const onClick = vi.fn();
    render(
      <UiCard onClick={onClick}>
        <input aria-label="Workspace name" defaultValue="Support" />
      </UiCard>
    );
    const input = screen.getByRole("textbox", { name: "Workspace name" });
    await userEvent.click(input);
    await userEvent.keyboard(" team{Enter}");
    expect(input).toHaveValue("Support team");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not cancel editing keys in contenteditable descendants", () => {
    const onClick = vi.fn();
    render(
      <UiCard onClick={onClick}>
        <div
          contentEditable
          suppressContentEditableWarning
          data-testid="editor"
        >
          Draft
        </div>
      </UiCard>
    );
    const editor = screen.getByTestId("editor");
    expect(fireEvent.keyDown(editor, { key: "Enter" })).toBe(true);
    expect(fireEvent.keyDown(editor, { key: " " })).toBe(true);
    fireEvent.click(editor);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps keyboard and SVG click targets in a custom nested control independent", () => {
    const onClick = vi.fn();
    const childClick = vi.fn();
    render(
      <UiCard onClick={onClick} aria-label="Workspace card">
        <div
          role="button"
          tabIndex={0}
          onClick={childClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.currentTarget.click();
            }
          }}
        >
          Preview
          <svg aria-hidden="true" data-testid="icon">
            <path d="M0 0" />
          </svg>
        </div>
      </UiCard>
    );
    const child = screen.getByRole("button", { name: "Preview" });
    fireEvent.click(screen.getByTestId("icon"));
    fireEvent.keyDown(child, { key: "Enter" });
    fireEvent.keyDown(child, { key: " " });
    expect(childClick).toHaveBeenCalledTimes(3);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not synthesize activation for another focusable descendant", () => {
    const onClick = vi.fn();
    render(
      <UiCard onClick={onClick}>
        <span tabIndex={0}>Secondary focus target</span>
      </UiCard>
    );
    const child = screen.getByText("Secondary focus target");
    fireEvent.click(child);
    fireEvent.keyDown(child, { key: "Enter" });
    fireEvent.keyDown(child, { key: " " });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("blocks disabled activation and a supplied tabIndex cannot restore tab access", async () => {
    const onClick = vi.fn();
    render(
      <>
        <button type="button">Before</button>
        <UiCard disabled tabIndex={0} onClick={onClick}>
          Disabled
        </UiCard>
        <button type="button">After</button>
      </>
    );
    const card = screen.getByRole("button", { name: "Disabled" });
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).not.toHaveAttribute("tabindex");
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "Enter" });
    fireEvent.keyDown(card, { key: " " });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not disable descendants when only the card action is disabled", async () => {
    const onClick = vi.fn();
    const childClick = vi.fn();
    render(
      <UiCard disabled onClick={onClick} aria-label="Workspace card">
        <button type="button" onClick={childClick}>
          Independent action
        </button>
      </UiCard>
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Independent action" })
    );
    expect(childClick).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("updates activation and focusability when disabled changes", () => {
    const onClick = vi.fn();
    const { rerender } = render(<UiCard onClick={onClick}>Workspace</UiCard>);
    const card = screen.getByRole("button");
    fireEvent.click(card);
    rerender(
      <UiCard onClick={onClick} disabled>
        Workspace
      </UiCard>
    );
    expect(card).not.toHaveAttribute("tabindex");
    fireEvent.click(card);
    rerender(<UiCard onClick={onClick}>Workspace</UiCard>);
    expect(card).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
