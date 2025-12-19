import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../dialog";

describe("Dialog", () => {
  it("renders trigger and opens on click", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Initially dialog content should not be visible
    expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();

    // Click trigger to open
    fireEvent.click(screen.getByText("Open Dialog"));

    // Dialog should now be visible
    await waitFor(() => {
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    });
  });

  it("renders with controlled open state", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Controlled Dialog")).toBeInTheDocument();
  });

  it("calls onOpenChange when closed", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogClose data-testid="close-btn">Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByTestId("close-btn"));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("shows close button by default", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("hides close button when hideCloseButton is true", () => {
    render(
      <Dialog open={true}>
        <DialogContent hideCloseButton>
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(
      screen.queryByRole("button", { name: /close/i })
    ).not.toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <Dialog open={true}>
        <DialogContent size="sm" data-testid="dialog-content">
          <DialogTitle>Small Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-sm");

    rerender(
      <Dialog open={true}>
        <DialogContent size="lg" data-testid="dialog-content">
          <DialogTitle>Large Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-2xl");

    rerender(
      <Dialog open={true}>
        <DialogContent size="xl" data-testid="dialog-content">
          <DialogTitle>XL Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-4xl");
  });

  it("applies default size when not specified", () => {
    render(
      <Dialog open={true}>
        <DialogContent data-testid="dialog-content">
          <DialogTitle>Default Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-lg");
  });

  it("applies custom className to DialogContent", () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-class" data-testid="dialog-content">
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("custom-class");
  });

  describe("DialogHeader", () => {
    it("renders with correct styling", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader data-testid="header">Header Content</DialogHeader>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("header")).toHaveClass("flex", "flex-col");
    });

    it("applies custom className", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader className="custom-header" data-testid="header">
              Header
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  describe("DialogFooter", () => {
    it("renders with correct styling", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogFooter data-testid="footer">Footer Content</DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("footer")).toHaveClass("flex");
    });

    it("applies custom className", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogFooter className="custom-footer" data-testid="footer">
              Footer
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  describe("DialogTitle", () => {
    it("renders with correct styling", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle data-testid="title">Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("title")).toHaveClass(
        "text-lg",
        "font-semibold"
      );
    });

    it("applies custom className", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle className="custom-title" data-testid="title">
              Title
            </DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  describe("DialogDescription", () => {
    it("renders with correct styling", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogDescription data-testid="desc">
              Description text
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("desc")).toHaveClass("text-sm");
    });

    it("applies custom className", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogDescription className="custom-desc" data-testid="desc">
              Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });
  });

  describe("Accessibility", () => {
    it("has proper dialog role", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("close button has accessible name", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });
  });
});
