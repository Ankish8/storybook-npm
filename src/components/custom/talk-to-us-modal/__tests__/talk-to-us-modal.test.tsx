import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TalkToUsModal } from "../talk-to-us-modal";

describe("TalkToUsModal", () => {
  it("renders nothing when closed", () => {
    render(<TalkToUsModal open={false} />);
    expect(screen.queryByText("Let's Talk!")).not.toBeInTheDocument();
  });

  it("renders modal content when open", () => {
    render(<TalkToUsModal open />);
    expect(screen.getByText("Let's Talk!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please contact our team for more details. We're here to help you choose the right plan."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Contact support")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(
      <TalkToUsModal
        open
        title="Need Help?"
        description="Our team is standing by."
      />
    );
    expect(screen.getByText("Need Help?")).toBeInTheDocument();
    expect(screen.getByText("Our team is standing by.")).toBeInTheDocument();
  });

  it("renders custom button labels", () => {
    render(
      <TalkToUsModal
        open
        primaryActionLabel="Get in touch"
        secondaryActionLabel="Maybe later"
      />
    );
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
    expect(screen.getByText("Maybe later")).toBeInTheDocument();
  });

  it("calls onPrimaryAction when primary button is clicked", () => {
    const handleClick = vi.fn();
    render(<TalkToUsModal open onPrimaryAction={handleClick} />);
    fireEvent.click(screen.getByText("Contact support"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onSecondaryAction and onOpenChange when secondary button is clicked", () => {
    const handleSecondary = vi.fn();
    const handleOpenChange = vi.fn();
    render(
      <TalkToUsModal
        open
        onSecondaryAction={handleSecondary}
        onOpenChange={handleOpenChange}
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleSecondary).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders default branded SVG icon when no custom icon is provided", () => {
    render(<TalkToUsModal open />);
    const svg = document.querySelector("svg[aria-hidden='true']");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 61 61");
  });

  it("renders custom icon when provided", () => {
    render(
      <TalkToUsModal
        open
        icon={<span data-testid="custom-icon">★</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    // Default SVG icon should not render
    expect(
      document.querySelector("svg[aria-hidden='true']")
    ).not.toBeInTheDocument();
  });

  it("uses DialogTitle for accessible heading", () => {
    render(<TalkToUsModal open />);
    const title = screen.getByText("Let's Talk!");
    expect(title).toHaveClass(
      "text-base",
      "font-semibold",
      "text-semantic-text-primary"
    );
  });

  it("uses DialogDescription for accessible description", () => {
    render(<TalkToUsModal open />);
    const desc = screen.getByText(
      "Please contact our team for more details. We're here to help you choose the right plan."
    );
    expect(desc).toHaveClass("text-sm", "text-semantic-text-muted");
  });

  it("hides the close button", () => {
    render(<TalkToUsModal open />);
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });
});
