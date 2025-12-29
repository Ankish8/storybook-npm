import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";
import { Bell } from "lucide-react";

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

  // Variants - text is always black (#181D27), only icon color varies
  it.each([
    ["default", "bg-semantic-bg-ui", "border-semantic-border-layout"],
    [
      "success",
      "bg-semantic-success-surface",
      "border-semantic-success-border",
    ],
    ["error", "bg-semantic-error-surface", "border-semantic-error-border"],
    [
      "destructive",
      "bg-semantic-error-surface",
      "border-semantic-error-border",
    ],
    [
      "warning",
      "bg-semantic-warning-surface",
      "border-semantic-warning-border",
    ],
    ["info", "bg-semantic-info-surface", "border-semantic-info-border"],
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
      expect(element).toHaveClass("text-semantic-text-primary"); // Always primary text
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
    expect(element).toHaveClass("rounded");
    expect(element).toHaveClass("border");
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

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Alert closable onClose={handleClose}>
        <AlertTitle>Close Me</AlertTitle>
      </Alert>
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("hides alert when close button is clicked (uncontrolled)", () => {
    render(
      <Alert closable data-testid="alert">
        <AlertTitle>Close Me</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("alert")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
  });

  // Controlled visibility
  it("respects open prop (controlled mode)", () => {
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
    expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
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

  it("applies font-semibold class", () => {
    render(<AlertTitle data-testid="title">Title</AlertTitle>);
    expect(screen.getByTestId("title")).toHaveClass("font-semibold");
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

  it("applies text-sm class", () => {
    render(<AlertDescription data-testid="desc">Description</AlertDescription>);
    expect(screen.getByTestId("desc")).toHaveClass("text-sm");
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
