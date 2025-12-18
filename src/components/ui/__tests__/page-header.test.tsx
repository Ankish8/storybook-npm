import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageHeader } from "../page-header";

describe("PageHeader", () => {
  // Basic rendering
  it("renders title correctly", () => {
    render(<PageHeader title="Test Title" />);
    expect(
      screen.getByRole("heading", { name: "Test Title" })
    ).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<PageHeader title="Title" description="Test description" />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<PageHeader title="Title" data-testid="header" />);
    const header = screen.getByTestId("header");
    expect(header.querySelectorAll("p")).toHaveLength(0);
  });

  // Icon rendering
  it("renders icon when provided", () => {
    render(
      <PageHeader
        title="Title"
        icon={<span data-testid="custom-icon">Icon</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render icon container when icon is not provided", () => {
    render(<PageHeader title="Title" data-testid="header" />);
    expect(screen.queryByLabelText("Go back")).not.toBeInTheDocument();
  });

  // Back button
  it("renders back button when showBackButton is true", () => {
    render(<PageHeader title="Title" showBackButton />);
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  it("calls onBackClick when back button is clicked", async () => {
    const user = userEvent.setup();
    const handleBackClick = vi.fn();
    render(
      <PageHeader title="Title" showBackButton onBackClick={handleBackClick} />
    );

    await user.click(screen.getByRole("button", { name: "Go back" }));
    expect(handleBackClick).toHaveBeenCalledTimes(1);
  });

  it("hides icon when showBackButton is true", () => {
    render(
      <PageHeader
        title="Title"
        icon={<span data-testid="custom-icon">Icon</span>}
        showBackButton
      />
    );
    expect(screen.queryByTestId("custom-icon")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  // Info icon
  it("renders info icon next to title when provided", () => {
    render(
      <PageHeader
        title="Title"
        infoIcon={<span data-testid="info-icon">i</span>}
      />
    );
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  // Actions
  it("renders actions when provided", () => {
    render(
      <PageHeader title="Title" actions={<button>Action Button</button>} />
    );
    // Actions render twice (desktop + mobile) with CSS visibility
    expect(
      screen.getAllByRole("button", { name: "Action Button" })
    ).toHaveLength(2);
  });

  it("renders multiple action buttons", () => {
    render(
      <PageHeader
        title="Title"
        actions={
          <>
            <button>Cancel</button>
            <button>Save</button>
          </>
        }
      />
    );
    // Actions render twice (desktop + mobile) with CSS visibility
    expect(screen.getAllByRole("button", { name: "Cancel" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Save" })).toHaveLength(2);
  });

  // Base styles
  it("applies base styles", () => {
    render(<PageHeader title="Title" data-testid="header" />);
    expect(screen.getByTestId("header")).toHaveClass("bg-white");
    expect(screen.getByTestId("header")).toHaveClass("flex");
    expect(screen.getByTestId("header")).toHaveClass("flex-col");
    expect(screen.getByTestId("header")).toHaveClass("sm:items-center");
  });

  // Custom styling
  it("applies custom className", () => {
    render(
      <PageHeader title="Title" className="custom-class" data-testid="header" />
    );
    expect(screen.getByTestId("header")).toHaveClass("custom-class");
  });

  // Ref forwarding
  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<PageHeader title="Title" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // Height spec
  it("applies correct height", () => {
    render(<PageHeader title="Title" data-testid="header" />);
    expect(screen.getByTestId("header")).toHaveClass("min-h-[76px]");
    expect(screen.getByTestId("header")).toHaveClass("sm:h-[76px]");
  });

  // Typography
  it("applies correct title styling", () => {
    render(<PageHeader title="Title" />);
    const title = screen.getByRole("heading", { name: "Title" });
    expect(title).toHaveClass("text-base");
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveClass("text-[#181D27]");
  });

  it("applies correct description styling", () => {
    render(<PageHeader title="Title" description="Description" />);
    const description = screen.getByText("Description");
    expect(description).toHaveClass("text-sm");
    expect(description).toHaveClass("text-[#181D27]");
  });

  // Accessibility
  it("has accessible heading structure", () => {
    render(<PageHeader title="Page Title" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Page Title");
  });

  it("back button has accessible label", () => {
    render(<PageHeader title="Title" showBackButton />);
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  // Spreads additional props
  it("spreads additional props", () => {
    render(
      <PageHeader title="Title" data-testid="header" aria-label="Page header" />
    );
    expect(screen.getByTestId("header")).toHaveAttribute(
      "aria-label",
      "Page header"
    );
  });

  // Overflow menu
  describe("mobileOverflowLimit", () => {
    it("shows overflow menu when actions exceed limit", () => {
      render(
        <PageHeader
          title="Title"
          layout="vertical"
          mobileOverflowLimit={2}
          actions={
            <>
              <button>Action 1</button>
              <button>Action 2</button>
              <button>Action 3</button>
            </>
          }
        />
      );
      // Should show 2 visible + 1 overflow trigger
      expect(
        screen.getByRole("button", { name: "Action 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action 2" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "More actions" })
      ).toBeInTheDocument();
      // Action 3 should not be visible (it's in the dropdown)
      expect(
        screen.queryByRole("button", { name: "Action 3" })
      ).not.toBeInTheDocument();
    });

    it("does not show overflow menu when actions are within limit", () => {
      render(
        <PageHeader
          title="Title"
          layout="vertical"
          mobileOverflowLimit={2}
          actions={
            <>
              <button>Action 1</button>
              <button>Action 2</button>
            </>
          }
        />
      );
      expect(
        screen.queryByRole("button", { name: "More actions" })
      ).not.toBeInTheDocument();
    });
  });

  // Layout prop tests
  describe("layout prop", () => {
    it("applies responsive layout by default", () => {
      render(<PageHeader title="Title" data-testid="header" />);
      expect(screen.getByTestId("header")).toHaveClass("flex-col");
      expect(screen.getByTestId("header")).toHaveClass("sm:flex-row");
    });

    it("applies horizontal layout when specified", () => {
      render(
        <PageHeader title="Title" layout="horizontal" data-testid="header" />
      );
      expect(screen.getByTestId("header")).toHaveClass("flex-row");
      expect(screen.getByTestId("header")).toHaveClass("items-center");
      expect(screen.getByTestId("header")).toHaveClass("h-[76px]");
    });

    it("applies vertical layout when specified", () => {
      render(
        <PageHeader title="Title" layout="vertical" data-testid="header" />
      );
      expect(screen.getByTestId("header")).toHaveClass("flex-col");
      expect(screen.getByTestId("header")).toHaveClass("min-h-[76px]");
      expect(screen.getByTestId("header")).toHaveClass("py-4");
    });

    it("applies correct action spacing for horizontal layout", () => {
      render(
        <PageHeader
          title="Title"
          layout="horizontal"
          actions={<button data-testid="action">Action</button>}
        />
      );
      // Horizontal layout: actions container has ml-4
      expect(
        screen.getByTestId("action").closest(".flex.items-center.gap-2")
      ).toHaveClass("ml-4");
    });

    it("applies correct action spacing for vertical layout", () => {
      render(
        <PageHeader
          title="Title"
          layout="vertical"
          actions={<button data-testid="action">Action</button>}
        />
      );
      // Vertical layout: expandable actions wrapper has mt-3
      expect(
        screen.getByTestId("action").closest(".flex.flex-col")
      ).toHaveClass("mt-3");
    });
  });
});
