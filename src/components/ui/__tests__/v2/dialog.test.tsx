import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import * as V1 from "../../dialog";
import * as V2 from "../../v2/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../v2/dialog";

describe("Dialog", () => {
  it("renders trigger and opens on click", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            Dialog description for accessibility
          </DialogDescription>
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
          <DialogDescription>Controlled dialog description</DialogDescription>
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
          <DialogDescription>Test dialog description</DialogDescription>
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
          <DialogDescription>Test description</DialogDescription>
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
          <DialogDescription>Test description</DialogDescription>
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
          <DialogDescription>Small dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-sm");

    rerender(
      <Dialog open={true}>
        <DialogContent size="lg" data-testid="dialog-content">
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>Large dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-2xl");

    rerender(
      <Dialog open={true}>
        <DialogContent size="xl" data-testid="dialog-content">
          <DialogTitle>XL Dialog</DialogTitle>
          <DialogDescription>XL dialog description</DialogDescription>
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
          <DialogDescription>Default dialog description</DialogDescription>
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
          <DialogDescription>Test description</DialogDescription>
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
            <DialogTitle>Header example</DialogTitle>
            <DialogDescription>Description for accessibility</DialogDescription>
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
            <DialogTitle>Header example</DialogTitle>
            <DialogDescription>Description for accessibility</DialogDescription>
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
            <DialogTitle>Test</DialogTitle>
            <DialogDescription>Description for accessibility</DialogDescription>
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
            <DialogTitle>Test</DialogTitle>
            <DialogDescription>Description for accessibility</DialogDescription>
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
            <DialogDescription>Description for accessibility</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("title")).toHaveClass(
        "text-base",
        "font-medium"
      );
    });

    it("applies custom className", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle className="custom-title" data-testid="title">
              Title
            </DialogTitle>
            <DialogDescription>Description for accessibility</DialogDescription>
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
            <DialogTitle>Test Title</DialogTitle>
            <DialogDescription data-testid="desc">
              Description text
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("desc")).toHaveClass("text-xs");
    });

    it("applies custom className", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>
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
            <DialogDescription>This dialog is accessible</DialogDescription>
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
            <DialogDescription>Test description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(
        screen.getByRole("button", { name: /close/i })
      ).toBeInTheDocument();
    });

    it("provides sr-only description when none is provided", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test Title Only</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      // Should have a hidden description for screen readers
      const srOnlyDescription = screen.getByText("Dialog content");
      expect(srOnlyDescription).toBeInTheDocument();
      expect(srOnlyDescription).toHaveClass("sr-only");
    });

    it("does not add sr-only description when DialogDescription is provided", () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
            <DialogDescription>Custom description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      // Should have the custom description
      expect(screen.getByText("Custom description")).toBeInTheDocument();
      // Should NOT have the fallback sr-only description
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });
  });
});

describe("Dialog v2 composition", () => {
  it("keeps header and footer padding overrides available to composed modals", () => {
    render(
      <Dialog open>
        <DialogContent ref={createRef<HTMLDivElement>()}>
          <DialogHeader className="p-4 gap-3" data-testid="custom-header">
            <DialogTitle>Custom composition</DialogTitle>
            <DialogDescription>
              Padding belongs to each section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-4 gap-3" data-testid="custom-footer">
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByTestId("custom-header")).toHaveClass("p-4", "gap-3");
    expect(screen.getByTestId("custom-header")).not.toHaveClass("p-6", "gap-4");
    expect(screen.getByTestId("custom-footer")).toHaveClass("p-4", "gap-3");
    expect(screen.getByTestId("custom-footer")).not.toHaveClass(
      "px-6",
      "pb-6",
      "gap-2"
    );
  });

  it("forwards the content ref to its portalled element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Dialog open>
        <DialogContent ref={ref} size="full">
          <DialogTitle>Full dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(ref.current).toBe(screen.getByRole("dialog"));
    expect(ref.current).toHaveClass("max-w-none", "h-[calc(100%-2rem)]");
  });

  it("allows a consumer to prevent Escape dismissal", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
          <DialogTitle>Unsaved work</DialogTitle>
          <DialogClose>Discard changes</DialogClose>
        </DialogContent>
      </Dialog>
    );
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe.each([
  ["v1", V1],
  ["v2", V2],
] as const)("%s keyboard and accessibility parity", (_version, components) => {
  it("traps Tab inside the modal and restores trigger focus on Escape", async () => {
    const user = userEvent.setup();
    const { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } =
      components;
    render(
      <Dialog>
        <DialogTrigger>Open form</DialogTrigger>
        <DialogContent hideCloseButton>
          <DialogTitle>Edit details</DialogTitle>
          <input aria-label="Name" />
          <DialogClose>Cancel</DialogClose>
          <button type="button">Save</button>
        </DialogContent>
      </Dialog>
    );
    const trigger = screen.getByRole("button", { name: "Open form" });
    await user.click(trigger);
    const name = screen.getByRole("textbox", { name: "Name" });
    await waitFor(() => expect(name).toHaveFocus());
    await user.tab();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    await user.tab();
    expect(name).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("links a visible title and nested description to the dialog", () => {
    const {
      Dialog,
      DialogContent,
      DialogTitle,
      DialogDescription,
      DialogHeader,
    } = components;
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <div>
              <DialogTitle>Workspace details</DialogTitle>
              <DialogDescription>Review before saving.</DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
    const dialog = screen.getByRole("dialog", { name: "Workspace details" });
    expect(dialog).toHaveAccessibleDescription("Review before saving.");
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });
});
