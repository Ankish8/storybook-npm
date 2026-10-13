import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert, AlertTitle, AlertDescription } from "../../v2/alert";
import { MotionGlobalConfig } from "motion/react";
import { Bell } from "lucide-react";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

// Presence semantics are real; skip interpolation because jsdom cannot measure auto heights.
beforeEach(() => {
  MotionGlobalConfig.skipAnimations = true;
});
afterEach(() => {
  MotionGlobalConfig.skipAnimations = false;
  vi.restoreAllMocks();
});

describe("Alert", () => {
  // Basic rendering
  it("renders children correctly", () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders with title and description", () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Alert description text")).toBeInTheDocument();
  });

  // Variants retain neutral body text; only the icon carries the status color.
  it.each([
    ["default", "bg-semantic-bg-primary", "border-semantic-border-layout"],
    [
      "success",
      "bg-semantic-success-surface",
      "border-[var(--color-success-200)]",
    ],
    ["error", "bg-semantic-error-surface", "border-[var(--color-error-200)]"],
    [
      "destructive",
      "bg-semantic-error-surface",
      "border-[var(--color-error-200)]",
    ],
    [
      "warning",
      "bg-semantic-warning-surface",
      "border-[var(--color-warning-200)]",
    ],
    ["info", "bg-semantic-info-surface", "border-[var(--color-info-200)]"],
  ] as const)(
    "renders %s variant with correct classes",
    (variant, bgClass, borderClass) => {
      render(
        <Alert variant={variant} data-testid="alert">
          <AlertTitle>Test</AlertTitle>
        </Alert>
      );
      const element = screen.getByTestId("alert");
      expect(element).toHaveClass(bgClass);
      expect(element).toHaveClass(
        "text-[var(--v2-text-secondary,var(--semantic-text-secondary))]"
      );
      expect(element).toHaveClass(borderClass);
    }
  );

  // Base styles
  it("applies base styles correctly", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Test</AlertTitle>
      </Alert>
    );
    const element = screen.getByTestId("alert");
    expect(element).toHaveClass("p-4");
    expect(element).toHaveClass("text-sm");
    expect(element).toHaveClass("rounded-lg");
    expect(element).toHaveClass("border");
  });

  it("matches Arc's type and spacing: 14px/500 title, 12px description 4px below, 18px icon, 1px resting shadow", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your updates are ready.</AlertDescription>
      </Alert>
    );
    expect(screen.getByTestId("alert")).toHaveClass(
      "shadow-[0_1px_2px_rgba(0,0,0,0.035)]"
    );
    expect(screen.getByRole("heading", { name: "Saved" })).toHaveClass(
      "text-sm",
      "font-medium",
      "leading-[1.4]"
    );
    expect(
      screen.getByText("Your updates are ready.").closest("p")
    ).toHaveClass("text-xs", "mt-1", "leading-[1.4]");
    expect(screen.getByTestId("alert").querySelector("svg")).toHaveClass(
      "size-[18px]"
    );
  });
  it("keeps the alert box inside a presence wrapper so its padding never has to collapse", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Saved</AlertTitle>
      </Alert>
    );
    const box = screen.getByRole("alert");
    expect(box).toBe(screen.getByTestId("alert"));
    expect(box.parentElement).not.toBeNull();
    expect(box.parentElement).not.toHaveAttribute("role");
  });

  // Icon rendering
  it("renders default icon based on variant", () => {
    render(
      <Alert variant="success" data-testid="alert">
        <AlertTitle>Success</AlertTitle>
      </Alert>
    );
    const alert = screen.getByTestId("alert");
    expect(alert.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    render(
      <Alert icon={<Bell data-testid="custom-icon" />} data-testid="alert">
        <AlertTitle>Custom Icon</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("hides icon when icon is null", () => {
    render(
      <Alert icon={null} data-testid="alert">
        <AlertTitle>No Icon</AlertTitle>
      </Alert>
    );
    const alert = screen.getByTestId("alert");
    expect(alert.querySelector("svg")).not.toBeInTheDocument();
  });

  it("hides icon when showIcon is false", () => {
    render(
      <Alert showIcon={false} data-testid="alert">
        <AlertTitle>No Icon</AlertTitle>
      </Alert>
    );
    const alert = screen.getByTestId("alert");
    expect(alert.querySelector("svg")).not.toBeInTheDocument();
  });

  it.each([false, 0, ""])(
    "retains the v1 default icon for a falsy custom icon (%s)",
    (icon) => {
      render(
        <Alert icon={icon} data-testid="alert">
          <AlertTitle>Default icon</AlertTitle>
        </Alert>
      );
      expect(
        screen.getByTestId("alert").querySelector("svg")
      ).toBeInTheDocument();
    }
  );

  // Close functionality
  it("renders close button when closable is true", () => {
    render(
      <Alert closable data-testid="alert">
        <AlertTitle>Closable Alert</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("does not render close button by default", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Not Closable</AlertTitle>
      </Alert>
    );
    expect(
      screen.queryByRole("button", { name: /close/i })
    ).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const handleClose = vi.fn();
    render(
      <Alert closable onClose={handleClose}>
        <AlertTitle>Close Me</AlertTitle>
      </Alert>
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
  });

  it("hides alert when close button is clicked (uncontrolled)", async () => {
    render(
      <Alert closable data-testid="alert">
        <AlertTitle>Close Me</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("alert")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() =>
      expect(screen.queryByTestId("alert")).not.toBeInTheDocument()
    );
  });

  // Controlled visibility
  it("respects open prop (controlled mode)", async () => {
    const { rerender } = render(
      <Alert open={true} data-testid="alert">
        <AlertTitle>Controlled</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("alert")).toBeInTheDocument();

    rerender(
      <Alert open={false} data-testid="alert">
        <AlertTitle>Controlled</AlertTitle>
      </Alert>
    );
    await waitFor(() =>
      expect(screen.queryByTestId("alert")).not.toBeInTheDocument()
    );
  });

  it("respects defaultOpen prop (uncontrolled mode)", () => {
    render(
      <Alert defaultOpen={false} data-testid="alert">
        <AlertTitle>Not Visible</AlertTitle>
      </Alert>
    );
    expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
  });

  // Action buttons
  it("renders action button", () => {
    render(
      <Alert action={<button>Retry</button>}>
        <AlertTitle>With Action</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders secondary action button", () => {
    render(
      <Alert secondaryAction={<button>Cancel</button>}>
        <AlertTitle>With Secondary Action</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders both action buttons", () => {
    render(
      <Alert
        action={<button>Save</button>}
        secondaryAction={<button>Discard</button>}
      >
        <AlertTitle>With Both Actions</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
  });

  // Accessibility
  it("has role='alert'", () => {
    render(
      <Alert>
        <AlertTitle>Accessible Alert</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("has aria-live='polite'", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Accessible Alert</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("alert")).toHaveAttribute("aria-live", "polite");
  });

  // Custom className
  it("applies custom className", () => {
    render(
      <Alert className="custom-class" data-testid="alert">
        <AlertTitle>Custom Class</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("alert")).toHaveClass("custom-class");
  });

  // Ref forwarding
  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <Alert ref={ref}>
        <AlertTitle>Ref Test</AlertTitle>
      </Alert>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // Spreads additional props
  it("spreads additional props", () => {
    render(
      <Alert data-testid="alert" aria-describedby="description">
        <AlertTitle>Props Test</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("alert")).toHaveAttribute(
      "aria-describedby",
      "description"
    );
  });

  it("keeps native attributes, style, event callbacks and the ref on the alert box", () => {
    const ref = { current: null as HTMLDivElement | null };
    const onClick = vi.fn();
    render(
      <Alert
        ref={ref}
        id="sync-notice"
        title="Connection status"
        role="status"
        aria-live="off"
        tabIndex={0}
        style={{ maxWidth: 384 }}
        onClick={onClick}
      >
        <AlertTitle>Sync paused</AlertTitle>
      </Alert>
    );
    const box = screen.getByRole("status");
    expect(ref.current).toBe(box);
    expect(box).toHaveAttribute("id", "sync-notice");
    expect(box).toHaveAttribute("title", "Connection status");
    expect(box).toHaveAttribute("aria-live", "off");
    expect(box).toHaveAttribute("tabindex", "0");
    expect(box).toHaveStyle({ maxWidth: "384px" });
    fireEvent.click(box);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("only uses defaultOpen on the first uncontrolled render", () => {
    const { rerender } = render(
      <Alert defaultOpen>
        <AlertTitle>Visible notice</AlertTitle>
      </Alert>
    );
    rerender(
      <Alert defaultOpen={false}>
        <AlertTitle>Visible notice</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("keeps caller actions independent of dismissal and preserves secondary-first order", async () => {
    const user = userEvent.setup();
    const secondary = vi.fn();
    const primary = vi.fn();
    const onClose = vi.fn();
    render(
      <Alert
        closable
        onClose={onClose}
        secondaryAction={<button onClick={secondary}>Later</button>}
        action={<button onClick={primary}>Reconnect</button>}
      >
        <AlertTitle>Sync paused</AlertTitle>
      </Alert>
    );
    expect(
      screen.getAllByRole("button").map((button) => button.textContent)
    ).toEqual(["Later", "Reconnect", ""]);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(secondary).toHaveBeenCalledOnce();
    await user.tab();
    await user.keyboard(" ");
    expect(primary).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("dismisses from the keyboard without submitting a containing form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const onClose = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Alert closable onClose={onClose}>
          <AlertTitle>Notice</AlertTitle>
        </Alert>
      </form>
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Close alert" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
  });

  it("hides and disables all outgoing actions immediately, then restores the controlled alert on reopen", () => {
    // Retain real motion here: the measured box remains in the DOM long enough to inspect its exit semantics.
    MotionGlobalConfig.skipAnimations = false;
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(80);
    const action = vi.fn();
    const onKeyDown = vi.fn();
    const notice = (open: boolean) => (
      <Alert
        open={open}
        animateExit
        onKeyDown={onKeyDown}
        action={<button onClick={action}>Reconnect</button>}
      >
        <AlertTitle>Sync paused</AlertTitle>
      </Alert>
    );
    const { rerender } = render(notice(true));
    const button = screen.getByRole("button", { name: "Reconnect" });
    const box = screen.getByRole("alert");
    rerender(notice(false));
    expect(box).toBeInTheDocument();
    expect(box.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(box.parentElement).toHaveAttribute("inert");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    expect(action).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();

    rerender(notice(true));
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(box.parentElement).not.toHaveAttribute("inert");
    expect(box.parentElement).not.toHaveAttribute("aria-hidden");
    fireEvent.click(button);
    expect(action).toHaveBeenCalledOnce();
  });

  it("exposes only current title and description while outgoing copy fades", () => {
    MotionGlobalConfig.skipAnimations = false;
    const { rerender } = render(
      <Alert>
        <AlertTitle>Sync paused</AlertTitle>
        <AlertDescription>Three local updates.</AlertDescription>
      </Alert>
    );
    rerender(
      <Alert variant="success">
        <AlertTitle>All updates synced</AlertTitle>
        <AlertDescription>Your team has the latest changes.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Sync paused")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(screen.getByText("Three local updates.")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(
      screen.getByRole("heading", { name: "All updates synced" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Your team has the latest changes.")
    ).not.toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });
});

describe("AlertTitle", () => {
  it("renders children correctly", () => {
    render(<AlertTitle>Test Title</AlertTitle>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders as h5 element", () => {
    render(<AlertTitle data-testid="title">Title</AlertTitle>);
    expect(screen.getByTestId("title").tagName).toBe("H5");
  });

  it("applies medium title weight", () => {
    render(<AlertTitle data-testid="title">Title</AlertTitle>);
    expect(screen.getByTestId("title")).toHaveClass("font-medium");
  });

  it("applies custom className", () => {
    render(
      <AlertTitle className="custom-class" data-testid="title">
        Title
      </AlertTitle>
    );
    expect(screen.getByTestId("title")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<AlertTitle ref={ref}>Title</AlertTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe("AlertDescription", () => {
  it("renders children correctly", () => {
    render(<AlertDescription>Test Description</AlertDescription>);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders as p element", () => {
    render(<AlertDescription data-testid="desc">Description</AlertDescription>);
    expect(screen.getByTestId("desc").tagName).toBe("P");
  });

  it("applies12px body text", () => {
    render(<AlertDescription data-testid="desc">Description</AlertDescription>);
    expect(screen.getByTestId("desc")).toHaveClass("text-xs");
  });

  it("applies custom className", () => {
    render(
      <AlertDescription className="custom-class" data-testid="desc">
        Description
      </AlertDescription>
    );
    expect(screen.getByTestId("desc")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<AlertDescription ref={ref}>Description</AlertDescription>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("has Bootstrap margin reset (m-0) to prevent 16px gap in Bootstrap host apps", () => {
    const { container } = render(
      <AlertDescription>Description text</AlertDescription>
    );
    assertNoBootstrapMarginBleed(container);
  });
});

describe("Type Compatibility", () => {
  it("variant prop is correctly typed from CVA", () => {
    render(
      <Alert variant="default">
        <AlertTitle>Type Check</AlertTitle>
      </Alert>
    );
    expect(screen.getByText("Type Check")).toBeInTheDocument();
  });

  it("accepts all variant values", () => {
    const variants = [
      "default",
      "success",
      "error",
      "destructive",
      "warning",
      "info",
    ] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Alert variant={variant}>
          <AlertTitle>{variant}</AlertTitle>
        </Alert>
      );
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });
});

describe("v2 presentations", () => {
  it("places fragmented titles in the overlay header and actions after content", () => {
    render(
      <Alert presentation="overlay" action={<button>Continue</button>}>
        <>
          <AlertTitle>Details</AlertTitle>
          <AlertDescription>Body text</AlertDescription>
        </>
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-presentation", "overlay");
    expect(alert.children[0]).toContainElement(screen.getByText("Details"));
    expect(alert.children[1]).toContainElement(screen.getByText("Body text"));
    expect(alert.children[1]).toContainElement(
      screen.getByRole("button", { name: "Continue" })
    );
  });
  it("retains controlled dismissal in the overlay presentation", async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Alert presentation="overlay" open closable onClose={onClose}>
        <AlertTitle>Notice</AlertTitle>
      </Alert>
    );
    fireEvent.click(screen.getByRole("button", { name: "Close alert" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(
      <Alert presentation="overlay" open={false} closable onClose={onClose}>
        <AlertTitle>Notice</AlertTitle>
      </Alert>
    );
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
  });
  it.each(["inline", "header", "overlay"] as const)(
    "gives the %s close button Arc's 28px target around a 16px icon without moving the layout",
    (presentation) => {
      render(
        <Alert presentation={presentation} closable>
          <AlertTitle>Notice</AlertTitle>
        </Alert>
      );
      const close = screen.getByRole("button", { name: "Close alert" });
      // 28px hit area; the -5px / -6px margins keep it from adding row height or pushing the content.
      expect(close).toHaveClass("size-7", "-my-[5px]", "-mr-1.5");
      expect(close).not.toHaveClass("size-5");
      expect(close.querySelector("svg")).toHaveClass("size-4");
      expect(close).toHaveAttribute("aria-label", "Close alert");
      expect(close).toHaveAttribute("type", "button");
    }
  );
  it("only recolours the close icon on hover-capable pointers", () => {
    render(
      <Alert closable>
        <AlertTitle>Notice</AlertTitle>
      </Alert>
    );
    const close = screen.getByRole("button", { name: "Close alert" });
    expect(close).toHaveClass(
      "[@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--v2-text-primary,var(--semantic-text-primary))]",
      "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-semantic-bg-ui"
    );
    expect(close).not.toHaveClass(
      "hover:text-[var(--v2-text-primary,var(--semantic-text-primary))]"
    );
  });
  it("keeps custom content and secondary actions usable in a header", () => {
    const act = vi.fn();
    render(
      <Alert
        presentation="header"
        showIcon={false}
        secondaryAction={<button onClick={act}>Review</button>}
      >
        <span>Custom content</span>
      </Alert>
    );
    fireEvent.click(screen.getByRole("button", { name: "Review" }));
    expect(act).toHaveBeenCalledOnce();
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });
});

it("removes an opt-in exit after its animation even when the layout has height", async () => {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(80);
  const { rerender } = render(
    <Alert open animateExit data-testid="animated-alert">
      Ready
    </Alert>
  );
  rerender(
    <Alert open={false} animateExit data-testid="animated-alert">
      Ready
    </Alert>
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByTestId("animated-alert")).not.toBeInTheDocument()
  );
});
