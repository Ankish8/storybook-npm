import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import * as V1 from "../../dialog";
import * as V2 from "../../v2/modal";
import {
  ModalRoot,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
  ModalMedia,
  ModalCancel,
  ModalAction,
} from "../../v2/modal";

describe("Dialog", () => {
  it("renders trigger and opens on click", async () => {
    render(
      <ModalRoot>
        <ModalTrigger>Open Dialog</ModalTrigger>
        <ModalContent>
          <ModalTitle>ModalRoot Title</ModalTitle>
          <ModalDescription>
            ModalRoot description for accessibility
          </ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    // Initially dialog content should not be visible
    expect(screen.queryByText("ModalRoot Title")).not.toBeInTheDocument();

    // Click trigger to open
    fireEvent.click(screen.getByText("Open Dialog"));

    // ModalRoot should now be visible
    await waitFor(() => {
      expect(screen.getByText("ModalRoot Title")).toBeInTheDocument();
    });
  });

  it("renders with controlled open state", () => {
    render(
      <ModalRoot open={true}>
        <ModalContent>
          <ModalTitle>Controlled Dialog</ModalTitle>
          <ModalDescription>Controlled dialog description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(screen.getByText("Controlled Dialog")).toBeInTheDocument();
  });

  it("calls onOpenChange when closed", async () => {
    const onOpenChange = vi.fn();
    render(
      <ModalRoot open={true} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Test Dialog</ModalTitle>
          <ModalDescription>Test dialog description</ModalDescription>
          <ModalClose data-testid="close-btn">Close</ModalClose>
        </ModalContent>
      </ModalRoot>
    );

    fireEvent.click(screen.getByTestId("close-btn"));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("shows close button by default", () => {
    render(
      <ModalRoot open={true}>
        <ModalContent>
          <ModalTitle>Test</ModalTitle>
          <ModalDescription>Test description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("hides close button when hideCloseButton is true", () => {
    render(
      <ModalRoot open={true}>
        <ModalContent hideCloseButton>
          <ModalTitle>Test</ModalTitle>
          <ModalDescription>Test description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(
      screen.queryByRole("button", { name: /close/i })
    ).not.toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <ModalRoot open={true}>
        <ModalContent size="sm" data-testid="dialog-content">
          <ModalTitle>Small Dialog</ModalTitle>
          <ModalDescription>Small dialog description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-sm");

    rerender(
      <ModalRoot open={true}>
        <ModalContent size="lg" data-testid="dialog-content">
          <ModalTitle>Large Dialog</ModalTitle>
          <ModalDescription>Large dialog description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-2xl");

    rerender(
      <ModalRoot open={true}>
        <ModalContent size="xl" data-testid="dialog-content">
          <ModalTitle>XL Dialog</ModalTitle>
          <ModalDescription>XL dialog description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-4xl");
  });

  it("applies default size when not specified", () => {
    render(
      <ModalRoot open={true}>
        <ModalContent data-testid="dialog-content">
          <ModalTitle>Default Dialog</ModalTitle>
          <ModalDescription>Default dialog description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("max-w-lg");
  });

  it("applies custom className to DialogContent", () => {
    render(
      <ModalRoot open={true}>
        <ModalContent className="custom-class" data-testid="dialog-content">
          <ModalTitle>Test</ModalTitle>
          <ModalDescription>Test description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    expect(screen.getByTestId("dialog-content")).toHaveClass("custom-class");
  });

  describe("DialogHeader", () => {
    it("renders with correct styling", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalHeader data-testid="header">Header Content</ModalHeader>
            <ModalTitle>Header example</ModalTitle>
            <ModalDescription>Description for accessibility</ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("header")).toHaveClass("grid", "text-center");
    });

    it("applies custom className", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalHeader className="custom-header" data-testid="header">
              Header
            </ModalHeader>
            <ModalTitle>Header example</ModalTitle>
            <ModalDescription>Description for accessibility</ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  describe("DialogFooter", () => {
    it("renders with correct styling", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Test</ModalTitle>
            <ModalDescription>Description for accessibility</ModalDescription>
            <ModalFooter data-testid="footer">Footer Content</ModalFooter>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("footer")).toHaveClass("flex");
    });

    it("applies custom className", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Test</ModalTitle>
            <ModalDescription>Description for accessibility</ModalDescription>
            <ModalFooter className="custom-footer" data-testid="footer">
              Footer
            </ModalFooter>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  describe("DialogTitle", () => {
    it("renders with correct styling", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle data-testid="title">Title</ModalTitle>
            <ModalDescription>Description for accessibility</ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("title")).toHaveClass(
        "text-base",
        "font-medium",
        "leading-6"
      );
    });

    it("applies custom className", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle className="custom-title" data-testid="title">
              Title
            </ModalTitle>
            <ModalDescription>Description for accessibility</ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  describe("DialogDescription", () => {
    it("renders with correct styling", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Test Title</ModalTitle>
            <ModalDescription data-testid="desc">
              Description text
            </ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("desc")).toHaveClass("text-sm", "leading-5");
    });

    it("applies custom className", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Test Title</ModalTitle>
            <ModalDescription className="custom-desc" data-testid="desc">
              Description
            </ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });
  });

  describe("Accessibility", () => {
    it("has proper dialog role", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Accessible Dialog</ModalTitle>
            <ModalDescription>This dialog is accessible</ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("close button has accessible name", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Test</ModalTitle>
            <ModalDescription>Test description</ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      expect(
        screen.getByRole("button", { name: /close/i })
      ).toBeInTheDocument();
    });

    it("provides sr-only description when none is provided", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Test Title Only</ModalTitle>
          </ModalContent>
        </ModalRoot>
      );

      // Should have a hidden description for screen readers
      const srOnlyDescription = screen.getByText("Dialog content");
      expect(srOnlyDescription).toBeInTheDocument();
      expect(srOnlyDescription).toHaveClass("sr-only");
    });

    it("does not add sr-only description when ModalDescription is provided", () => {
      render(
        <ModalRoot open={true}>
          <ModalContent>
            <ModalTitle>Test</ModalTitle>
            <ModalDescription>Custom description</ModalDescription>
          </ModalContent>
        </ModalRoot>
      );

      // Should have the custom description
      expect(screen.getByText("Custom description")).toBeInTheDocument();
      // Should NOT have the fallback sr-only description
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });
  });
});

describe("ModalRoot v2 composition", () => {
  it("keeps header and footer padding overrides available to composed modals", () => {
    render(
      <ModalRoot open>
        <ModalContent ref={createRef<HTMLDivElement>()}>
          <ModalHeader className="p-4 gap-3" data-testid="custom-header">
            <ModalTitle>Custom composition</ModalTitle>
            <ModalDescription>
              Padding belongs to each section.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="p-4 gap-3" data-testid="custom-footer">
            <ModalClose>Cancel</ModalClose>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    );
    expect(screen.getByTestId("custom-header")).toHaveClass("p-4", "gap-3");
    expect(screen.getByTestId("custom-header")).not.toHaveClass("p-6", "gap-2");
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
      <ModalRoot open>
        <ModalContent ref={ref} size="full">
          <ModalTitle>Full dialog</ModalTitle>
        </ModalContent>
      </ModalRoot>
    );
    expect(ref.current).toBe(screen.getByRole("dialog"));
    expect(ref.current).toHaveClass("max-w-none", "h-[calc(100%-2rem)]");
  });

  it("allows a consumer to prevent Escape dismissal", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ModalRoot defaultOpen onOpenChange={onOpenChange}>
        <ModalContent onEscapeKeyDown={(event) => event.preventDefault()}>
          <ModalTitle>Unsaved work</ModalTitle>
          <ModalClose>Discard changes</ModalClose>
        </ModalContent>
      </ModalRoot>
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

// v1 and v2 expose the same parts under different names; both must behave the same.
const v1Parts = {
  ModalRoot: V1.Dialog,
  ModalTrigger: V1.DialogTrigger,
  ModalContent: V1.DialogContent,
  ModalTitle: V1.DialogTitle,
  ModalDescription: V1.DialogDescription,
  ModalHeader: V1.DialogHeader,
  ModalClose: V1.DialogClose,
};
describe.each([
  ["v1", v1Parts],
  ["v2", V2],
] as const)("%s keyboard and accessibility parity", (_version, components) => {
  it("traps Tab inside the modal and restores trigger focus on Escape", async () => {
    const user = userEvent.setup();
    const { ModalRoot, ModalTrigger, ModalContent, ModalTitle, ModalClose } =
      components;
    render(
      <ModalRoot>
        <ModalTrigger>Open form</ModalTrigger>
        <ModalContent hideCloseButton>
          <ModalTitle>Edit details</ModalTitle>
          <input aria-label="Name" />
          <ModalClose>Cancel</ModalClose>
          <button type="button">Save</button>
        </ModalContent>
      </ModalRoot>
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
      ModalRoot,
      ModalContent,
      ModalTitle,
      ModalDescription,
      ModalHeader,
    } = components;
    render(
      <ModalRoot open>
        <ModalContent>
          <ModalHeader>
            <div>
              <ModalTitle>Workspace details</ModalTitle>
              <ModalDescription>Review before saving.</ModalDescription>
            </div>
          </ModalHeader>
        </ModalContent>
      </ModalRoot>
    );
    const dialog = screen.getByRole("dialog", { name: "Workspace details" });
    expect(dialog).toHaveAccessibleDescription("Review before saving.");
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });
});

describe("ModalContent scroll and close button", () => {
  it("scrolls inside the viewport instead of growing past it", () => {
    render(
      <ModalRoot open>
        <ModalContent data-testid="content">
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );
    expect(screen.getByTestId("content")).toHaveClass(
      "overflow-y-auto",
      "max-h-[calc(100vh-2rem)]"
    );
  });

  it("draws shadcn's corner close button: a ghost icon button, last in the DOM", () => {
    render(
      <ModalRoot open>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );
    const close = screen.getByRole("button", { name: "Close" });
    expect(close).toHaveClass("absolute", "right-2", "top-2");
    expect(close.querySelector("svg")).toHaveClass("lucide-x");
    // Last child, so Tab order and initial focus do not start on it.
    expect(close.parentElement?.lastElementChild).toBe(close);
  });

  it("marks itself so the header leaves room for the close button", () => {
    render(
      <ModalRoot open>
        <ModalContent data-testid="content">
          <ModalHeader data-testid="header">
            <ModalTitle>Title</ModalTitle>
            <ModalDescription>Description</ModalDescription>
          </ModalHeader>
        </ModalContent>
      </ModalRoot>
    );
    expect(screen.getByTestId("content")).toHaveAttribute("data-close", "true");
    expect(screen.getByTestId("header")).toHaveClass(
      "group-data-[close=true]/modal:pr-8"
    );
  });

  it("has no close button or marker with hideCloseButton", () => {
    render(
      <ModalRoot open>
        <ModalContent hideCloseButton data-testid="content">
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("content")).not.toHaveAttribute("data-close");
  });

  it("still closes on Escape and from the close button", async () => {
    const onOpenChange = vi.fn();
    render(
      <ModalRoot open onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    onOpenChange.mockClear();
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("ModalContent layout attributes and sizes", () => {
  it.each([
    ["xs", "max-w-xs", "stack"],
    ["sm", "max-w-sm", "beside"],
    ["default", "max-w-lg", "beside"],
    ["lg", "max-w-2xl", "beside"],
    ["xl", "max-w-4xl", "beside"],
  ] as const)("size %s is %s and lays out as %s", (size, width, layout) => {
    render(
      <ModalRoot open>
        <ModalContent size={size} data-testid="content">
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );
    const content = screen.getByTestId("content");
    expect(content).toHaveClass(width, "p-4", "gap-4");
    expect(content).toHaveAttribute("data-size", size);
    expect(content).toHaveAttribute("data-layout", layout);
  });

  it("puts the header's text beside an icon tile only in the beside layout", () => {
    render(
      <ModalRoot open>
        <ModalContent>
          <ModalHeader data-testid="header">
            <ModalMedia>
              <svg />
            </ModalMedia>
            <ModalTitle>Title</ModalTitle>
            <ModalDescription>Description</ModalDescription>
          </ModalHeader>
        </ModalContent>
      </ModalRoot>
    );
    const header = screen.getByTestId("header");
    expect(header).toHaveClass(
      "grid-rows-[auto_auto_1fr]",
      "sm:group-data-[layout=beside]/modal:grid-cols-[auto_1fr]"
    );
  });

  it("gives a header with no icon tile no extra rows", () => {
    render(
      <ModalRoot open>
        <ModalContent>
          <ModalHeader data-testid="header">
            <ModalTitle>Title</ModalTitle>
            <ModalDescription>Description</ModalDescription>
          </ModalHeader>
        </ModalContent>
      </ModalRoot>
    );
    expect(screen.getByTestId("header")).not.toHaveClass(
      "grid-rows-[auto_auto_1fr]"
    );
  });

  it("splits the footer into two equal columns in the stack layout", () => {
    render(
      <ModalRoot open>
        <ModalContent size="xs">
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
          <ModalFooter data-testid="footer">
            <ModalCancel>Cancel</ModalCancel>
            <ModalAction>OK</ModalAction>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    );
    expect(screen.getByTestId("footer")).toHaveClass(
      "group-data-[layout=stack]/modal:grid",
      "group-data-[layout=stack]/modal:grid-cols-2",
      "border-t"
    );
  });
});

describe("ModalCancel and ModalAction", () => {
  it("Cancel closes the modal; Action does not", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onAction = vi.fn();
    render(
      <ModalRoot open onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
          <ModalFooter>
            <ModalCancel>Cancel</ModalCancel>
            <ModalAction onClick={onAction}>Continue</ModalAction>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("both match 44px form fields, and Cancel is an outline", () => {
    render(
      <ModalRoot open>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
          <ModalFooter>
            <ModalCancel>Cancel</ModalCancel>
            <ModalAction>Continue</ModalAction>
          </ModalFooter>
        </ModalContent>
      </ModalRoot>
    );
    for (const name of ["Cancel", "Continue"]) {
      expect(screen.getByRole("button", { name })).toHaveClass(
        "h-11",
        "rounded-lg",
        "px-4"
      );
    }
  });
});

describe("v1 names are the Modal parts", () => {
  it("exports every v1 Dialog name as the same object", () => {
    expect(V2.Dialog).toBe(V2.ModalRoot);
    expect(V2.DialogTrigger).toBe(V2.ModalTrigger);
    expect(V2.DialogContent).toBe(V2.ModalContent);
    expect(V2.DialogHeader).toBe(V2.ModalHeader);
    expect(V2.DialogFooter).toBe(V2.ModalFooter);
    expect(V2.DialogTitle).toBe(V2.ModalTitle);
    expect(V2.DialogDescription).toBe(V2.ModalDescription);
    expect(V2.DialogClose).toBe(V2.ModalClose);
    expect(V2.DialogOverlay).toBe(V2.ModalOverlay);
    expect(V2.DialogPortal).toBe(V2.ModalPortal);
    expect(V2.dialogContentVariants).toBe(V2.modalContentVariants);
    expect(Object.keys(V1).sort()).toEqual(
      expect.arrayContaining([
        "Dialog",
        "DialogContent",
        "DialogHeader",
        "DialogFooter",
        "DialogTitle",
        "DialogDescription",
        "DialogClose",
        "DialogTrigger",
        "DialogOverlay",
        "DialogPortal",
        "dialogContentVariants",
      ])
    );
    for (const name of Object.keys(V1)) {
      expect(V2).toHaveProperty(name);
    }
  });
});

describe("ModalRoot Arc parity", () => {
  it("opens with a transform spring plus a separate 160ms fade, and a 240ms blurred backdrop", () => {
    render(
      <ModalRoot open>
        <ModalContent data-testid="content">
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );
    const content = screen.getByTestId("content");
    expect(content).toHaveClass(
      "data-[state=open]:motion-safe:[animation-name:enter,v2-fade-in]",
      "data-[state=open]:motion-safe:[animation-duration:500ms,160ms]",
      "data-[state=open]:motion-safe:zoom-in-[0.96]",
      "data-[state=open]:motion-safe:[--tw-enter-translate-y:8px]",
      "data-[state=closed]:motion-safe:[animation-duration:160ms]",
      "data-[state=closed]:motion-safe:zoom-out-[0.98]",
      "data-[state=closed]:motion-safe:[--tw-exit-translate-y:4px]"
    );
    // Reduced motion keeps only an opacity fade.
    expect(content).toHaveClass(
      "motion-reduce:data-[state=open]:animate-[v2-fade-in_120ms_ease-out]"
    );
    const overlay = document.querySelector("[data-state='open'].fixed.inset-0");
    expect(overlay).toHaveClass(
      "backdrop-blur-[7px]",
      "data-[state=open]:motion-safe:[animation-duration:240ms]",
      "data-[state=closed]:motion-safe:[animation-duration:160ms]"
    );
  });

  it("uses Arc's 1px border and floating shadow", () => {
    render(
      <ModalRoot open>
        <ModalContent data-testid="content">
          <ModalTitle>Title</ModalTitle>
          <ModalDescription>Description</ModalDescription>
        </ModalContent>
      </ModalRoot>
    );
    const content = screen.getByTestId("content");
    expect(content).toHaveClass("border", "border-solid");
    expect(content.className).toContain(
      "shadow-[0_20px_48px_rgba(0,0,0,0.105)"
    );
  });
});
