import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal, ModalAction } from "../../v2/modal";
import { Button } from "../../v2/button";

describe("Modal", () => {
  it("renders title", () => {
    render(
      <Modal
        open={true}
        title="Confirm Action"
        description="Please confirm this action"
      />
    );

    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Are you sure you want to proceed?"
      />
    );

    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Please confirm"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole("button", { name: /yes/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel and onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Please confirm or cancel"
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders default variant button by default", () => {
    render(
      <Modal open={true} title="Confirm" description="Default variant test" />
    );

    const confirmButton = screen.getByRole("button", { name: /yes/i });
    // Button uses semantic color tokens
    expect(confirmButton).toHaveClass("bg-semantic-primary");
  });

  it("renders destructive variant button when variant is destructive", () => {
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Destructive variant test"
        variant="destructive"
      />
    );

    const confirmButton = screen.getByRole("button", { name: /yes/i });
    // The v2 destructive action uses the reviewed red-text treatment.
    expect(confirmButton).toHaveClass(
      "text-[var(--v2-button-danger,oklch(0.54_0.21_25))]"
    );
  });

  it("uses custom button text", () => {
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Custom button text test"
        confirmButtonText="Proceed"
        cancelButtonText="Go Back"
      />
    );

    expect(screen.getByRole("button", { name: "Proceed" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument();
  });

  it("shows loading state on confirm button", () => {
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Loading state test"
        loading={true}
      />
    );

    expect(screen.getByRole("button", { name: /yes/i })).toBeDisabled();
  });

  it("disables cancel button when loading", () => {
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Loading state test"
        loading={true}
      />
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("renders with trigger for uncontrolled usage", async () => {
    const user = userEvent.setup();
    render(
      <Modal
        trigger={<Button>Open Modal</Button>}
        title="Triggered Modal"
        description="Modal opened via trigger"
      />
    );

    expect(screen.getByText("Open Modal")).toBeInTheDocument();

    await user.click(screen.getByText("Open Modal"));

    await waitFor(() => {
      expect(screen.getByText("Triggered Modal")).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(
      <Modal
        open={true}
        title="Confirm"
        description="Custom class test"
        className="custom-class"
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders with ReactNode title", () => {
    render(
      <Modal
        open={true}
        title={<span data-testid="custom-title">Custom Title</span>}
        description="ReactNode title test"
      />
    );

    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
  });

  it("renders with ReactNode description", () => {
    render(
      <Modal
        open={true}
        title="Title"
        description={
          <span data-testid="custom-desc">
            Custom <strong>description</strong>
          </span>
        }
      />
    );

    expect(screen.getByTestId("custom-desc")).toBeInTheDocument();
  });

  describe("Accessibility", () => {
    it("has proper dialog role", () => {
      render(
        <Modal open={true} title="Confirm" description="Accessibility test" />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has accessible buttons", () => {
      render(
        <Modal
          open={true}
          title="Confirm"
          description="Button accessibility test"
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
        />
      );

      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    it("has description for screen readers", () => {
      render(
        <Modal
          open={true}
          title="Confirm"
          description="This action cannot be undone"
        />
      );

      expect(
        screen.getByText("This action cannot be undone")
      ).toBeInTheDocument();
    });

    it("provides sr-only description when none is provided", () => {
      render(<Modal open={true} title="Confirm Action" />);

      // Should have a hidden description for screen readers
      const srOnlyDescription = screen.getByText("Confirmation dialog");
      expect(srOnlyDescription).toBeInTheDocument();
      expect(srOnlyDescription).toHaveClass("sr-only");
    });

    it("shows visible description when provided", () => {
      render(<Modal open={true} title="Confirm" description="Are you sure?" />);

      const description = screen.getByText("Are you sure?");
      expect(description).toBeInTheDocument();
      expect(description).not.toHaveClass("sr-only");
    });
  });

  describe("Controlled vs Uncontrolled", () => {
    it("works in controlled mode", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      const { rerender } = render(
        <Modal
          open={true}
          onOpenChange={onOpenChange}
          title="Controlled"
          description="Controlled mode test"
        />
      );

      expect(screen.getByText("Controlled")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /cancel/i }));
      expect(onOpenChange).toHaveBeenCalledWith(false);

      // Dialog should still be visible until parent updates open prop
      rerender(
        <Modal
          open={false}
          onOpenChange={onOpenChange}
          title="Controlled"
          description="Controlled mode test"
        />
      );

      await waitFor(() => {
        expect(screen.queryByText("Controlled")).not.toBeInTheDocument();
      });
    });

    it("works in uncontrolled mode with trigger", async () => {
      const user = userEvent.setup();
      render(
        <Modal
          trigger={<Button>Trigger</Button>}
          title="Uncontrolled"
          description="Uncontrolled mode test"
        />
      );

      // Initially closed
      expect(screen.queryByText("Uncontrolled")).not.toBeInTheDocument();

      // Click trigger to open
      await user.click(screen.getByText("Trigger"));

      await waitFor(() => {
        expect(screen.getByText("Uncontrolled")).toBeInTheDocument();
      });
    });
  });
});

describe("Modal close button", () => {
  it("is off by default: Cancel and Escape already dismiss", () => {
    render(<Modal open title="Confirm" />);
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
  });

  it("shows a named close button when asked, and it dismisses without calling onCancel", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onCancel = vi.fn();
    render(
      <Modal
        open
        title="Confirm"
        showCloseButton
        onOpenChange={onOpenChange}
        onCancel={onCancel}
      />
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("keeps long titles clear of the close button", () => {
    render(<Modal open title="Confirm" showCloseButton />);
    expect(
      screen.getByText("Confirm").closest("[data-slot=modal-header]")
    ).toHaveClass("group-data-[close=true]/modal:pr-8");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-close", "true");
  });
});

describe("Modal layout", () => {
  const shell = () => screen.getByRole("dialog");

  it("uses the 384px dialog with 16px padding and gap by default", () => {
    render(<Modal open title="Confirm" />);
    expect(shell()).toHaveAttribute("data-size", "sm");
    expect(shell()).toHaveAttribute("data-layout", "beside");
    expect(shell()).toHaveClass("max-w-sm", "p-4", "gap-4");
  });

  it('narrows to 320px with size="xs" and splits the actions into two equal columns', () => {
    render(<Modal open title="Confirm" size="xs" />);
    expect(shell()).toHaveAttribute("data-size", "xs");
    expect(shell()).toHaveAttribute("data-layout", "stack");
    expect(shell()).toHaveClass("max-w-xs");
    const footer = shell().querySelector("[data-slot=modal-footer]");
    expect(footer).toHaveClass(
      "group-data-[layout=stack]/modal:grid",
      "group-data-[layout=stack]/modal:grid-cols-2"
    );
  });

  it("aligns the default size's text beside the icon from the sm breakpoint", () => {
    render(<Modal open title="Confirm" icon={<svg aria-hidden />} />);
    const header = shell().querySelector("[data-slot=modal-header]");
    expect(header).toHaveClass(
      "sm:group-data-[layout=beside]/modal:place-items-start",
      "sm:group-data-[layout=beside]/modal:text-left"
    );
    expect(shell().querySelector("[data-slot=modal-media]")).toHaveClass(
      "sm:group-data-[layout=beside]/modal:row-span-2"
    );
  });

  it("keeps size sm centred at every width", () => {
    render(<Modal open title="Confirm" size="xs" />);
    const header = shell().querySelector("[data-slot=modal-header]");
    expect(header).toHaveClass("text-center");
    expect(shell()).toHaveAttribute("data-layout", "stack");
  });

  it("sets the title and description on shadcn's 24px / 20px line heights", () => {
    render(<Modal open title="Confirm" description="Details" />);
    expect(screen.getByText("Confirm")).toHaveClass("text-base", "leading-6");
    expect(screen.getByText("Details")).toHaveClass("text-sm", "leading-5");
  });

  it("puts a muted, bordered footer strip behind the actions", () => {
    render(<Modal open title="Confirm" />);
    const footer = shell().querySelector("[data-slot=modal-footer]");
    expect(footer).toHaveClass("border-t", "-mx-4", "-mb-4", "p-4");
  });

  it("has exactly one description element, so aria-describedby is unambiguous", () => {
    render(<Modal open title="Confirm" />);
    const describedBy = shell().getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.querySelectorAll(`[id="${describedBy}"]`)).toHaveLength(1);
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("forwards its ref to the dialog content", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Modal ref={ref} open title="Confirm" />);
    expect(ref.current).toBe(shell());
  });
});

describe("Modal icon", () => {
  const media = () =>
    screen.getByRole("dialog").querySelector("[data-slot=modal-media]");

  it("has no icon by default, like shadcn's basic alert dialog", () => {
    render(<Modal open title="Confirm" />);
    expect(media()).toBeNull();
    expect(screen.getByRole("dialog").querySelector("svg")).toBeNull();
  });

  it("has no icon by default for the destructive variant either", () => {
    render(<Modal open title="Confirm" variant="destructive" />);
    expect(media()).toBeNull();
  });

  it("renders a passed icon in a neutral 40px tile", () => {
    render(
      <Modal open title="Confirm" icon={<svg data-testid="custom-icon" />} />
    );
    expect(media()).toHaveClass("size-10", "rounded-md", "bg-semantic-bg-ui");
    expect(media()).toContainElement(screen.getByTestId("custom-icon"));
  });

  it("tints the tile for the destructive variant", () => {
    render(
      <Modal
        open
        title="Confirm"
        variant="destructive"
        icon={<svg data-testid="custom-icon" />}
      />
    );
    expect(media()).toHaveClass(
      "bg-semantic-error-surface",
      "text-semantic-error-primary"
    );
  });

  it("shows no tile for icon={null} or icon={false}", () => {
    const { rerender } = render(<Modal open title="Confirm" icon={null} />);
    expect(media()).toBeNull();
    rerender(<Modal open title="Confirm" icon={false} />);
    expect(media()).toBeNull();
  });

  it("keeps the text on the left from the sm breakpoint when there is no icon", () => {
    render(<Modal open title="Confirm" />);
    expect(
      screen.getByRole("dialog").querySelector("[data-slot=modal-header]")
    ).toHaveClass(
      "sm:group-data-[layout=beside]/modal:text-left",
      "sm:group-data-[layout=beside]/modal:place-items-start"
    );
  });
});

describe("Modal actions", () => {
  it("matches the confirmation field's 44px height and corners", () => {
    render(<Modal open title="Confirm" />);
    for (const name of ["Cancel", "Yes"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveClass("h-11", "rounded-lg", "px-4");
      expect(button).not.toHaveClass("h-8");
    }
  });
});

describe("Modal type-to-confirm (requireText)", () => {
  const confirm = () => screen.getByRole("button", { name: "Delete" });

  it("shows no field and enables confirm without requireText", () => {
    render(<Modal open title="T" confirmButtonText="Delete" />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(confirm()).toBeEnabled();
  });

  it("disables confirm until the exact phrase is typed", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <Modal
        open
        title="T"
        requireText="DELETE"
        confirmButtonText="Delete"
        onConfirm={onConfirm}
      />
    );
    expect(confirm()).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "DELET");
    expect(confirm()).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "E");
    expect(confirm()).toBeEnabled();
    await user.click(confirm());
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("is case-sensitive", async () => {
    const user = userEvent.setup();
    render(
      <Modal open title="T" requireText="DELETE" confirmButtonText="Delete" />
    );
    await user.type(screen.getByRole("textbox"), "delete");
    expect(confirm()).toBeDisabled();
  });

  it("does not call onConfirm while the phrase is wrong", async () => {
    const onConfirm = vi.fn();
    render(
      <Modal
        open
        title="T"
        requireText="DELETE"
        confirmButtonText="Delete"
        onConfirm={onConfirm}
      />
    );
    // The native `disabled` already blocks this click; the handler also re-checks the phrase as a backstop.
    fireEvent.click(confirm());
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("keeps confirm disabled while loading even with the right phrase", async () => {
    const user = userEvent.setup();
    render(
      <Modal
        open
        title="T"
        requireText="DELETE"
        confirmButtonText="Delete"
        loading
      />
    );
    await user.type(screen.getByRole("textbox"), "DELETE");
    expect(confirm()).toBeDisabled();
  });

  it("labels the field and uses the phrase as its placeholder", () => {
    render(<Modal open title="T" requireText="DELETE" />);
    const field = screen.getByLabelText(
      'Enter "DELETE" in uppercase to confirm'
    );
    expect(field).toBe(screen.getByRole("textbox"));
    expect(field).toHaveAttribute("placeholder", "DELETE");
    expect(field).toHaveAttribute("autocomplete", "off");
  });

  it("only says 'in uppercase' for an uppercase phrase", () => {
    render(<Modal open title="T" requireText="my-webhook" />);
    expect(screen.getByLabelText('Enter "my-webhook" to confirm')).toBe(
      screen.getByRole("textbox")
    );
  });

  it("accepts a custom label and field id", () => {
    render(
      <Modal
        open
        title="T"
        requireText="DELETE"
        requireTextLabel="Type DELETE below"
        inputId="my-field"
      />
    );
    const field = screen.getByLabelText("Type DELETE below");
    expect(field).toHaveAttribute("id", "my-field");
  });

  it("gives the field a unique generated id by default", () => {
    render(<Modal open title="T" requireText="DELETE" />);
    expect(screen.getByRole("textbox").id).toBeTruthy();
  });

  it("focuses the field first, since that is what is being asked for", async () => {
    render(<Modal open title="T" requireText="DELETE" />);
    await waitFor(() => expect(screen.getByRole("textbox")).toHaveFocus());
  });

  it("clears the phrase when the modal closes, so reopening is not pre-confirmed", async () => {
    const { rerender } = render(<Modal open title="T" requireText="DELETE" />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "DELETE" },
    });
    rerender(<Modal open={false} title="T" requireText="DELETE" />);
    rerender(<Modal open title="T" requireText="DELETE" />);
    await waitFor(() => expect(screen.getByRole("textbox")).toHaveValue(""));
  });

  it("clears the phrase when an uncontrolled modal is cancelled", async () => {
    const user = userEvent.setup();
    render(
      <Modal title="T" requireText="DELETE" trigger={<Button>Open</Button>} />
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.type(screen.getByRole("textbox"), "DELETE");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("falls back to the screen-reader description, or a custom one", () => {
    const { rerender } = render(<Modal open title="T" requireText="DELETE" />);
    expect(screen.getByText("Confirmation dialog")).toHaveClass("sr-only");
    rerender(
      <Modal
        open
        title="T"
        requireText="DELETE"
        srDescription="This cannot be undone"
      />
    );
    expect(screen.getByText("This cannot be undone")).toHaveClass("sr-only");
  });
});

it("cancels an uncontrolled modal and returns focus to its trigger", async () => {
  const user = userEvent.setup();
  const cancel = vi.fn();
  render(
    <Modal
      title="Review"
      trigger={<Button>Open review</Button>}
      onCancel={cancel}
    />
  );
  const trigger = screen.getByRole("button", { name: "Open review" });
  await user.click(trigger);
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(trigger).toHaveFocus();
});

it("puts initial focus on Cancel, the safe choice", async () => {
  render(<Modal open title="Delete" variant="destructive" />);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
  );
});

describe("Modal as a form and with a custom footer", () => {
  it("renders children as a body between the header and the footer", () => {
    render(
      <Modal open title="Edit profile" confirmButtonText="Save">
        <input aria-label="Name" />
      </Modal>
    );
    const body = screen
      .getByRole("dialog")
      .querySelector("[data-slot=modal-body]");
    expect(body).toContainElement(
      screen.getByRole("textbox", { name: "Name" })
    );
    expect(body).toHaveClass("grid", "gap-4");
  });

  it("has no body when there are no children", () => {
    render(<Modal open title="Confirm" />);
    expect(
      screen.getByRole("dialog").querySelector("[data-slot=modal-body]")
    ).toBeNull();
  });

  it("saves through onConfirm and blocks it with confirmDisabled", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const { rerender } = render(
      <Modal
        open
        title="Edit"
        confirmButtonText="Save"
        confirmDisabled
        onConfirm={onConfirm}
      />
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    rerender(
      <Modal open title="Edit" confirmButtonText="Save" onConfirm={onConfirm} />
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("replaces the default actions with a footer of your own", () => {
    render(
      <Modal open title="Done" footer={<ModalAction>Got it</ModalAction>} />
    );
    expect(screen.getByRole("button", { name: "Got it" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Yes" })
    ).not.toBeInTheDocument();
  });

  it("shows no footer at all with footer={null}", () => {
    render(<Modal open title="Info" description="Read this." footer={null} />);
    expect(
      screen.getByRole("dialog").querySelector("[data-slot=modal-footer]")
    ).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("defaults to the 384px sm size and accepts every size", () => {
    const { rerender } = render(<Modal open title="T" />);
    expect(screen.getByRole("dialog")).toHaveClass("max-w-sm");
    for (const [size, width] of [
      ["default", "max-w-lg"],
      ["lg", "max-w-2xl"],
      ["xl", "max-w-4xl"],
    ] as const) {
      rerender(<Modal open title="T" size={size} />);
      expect(screen.getByRole("dialog")).toHaveClass(width);
    }
  });
});

describe("Modal initial focus", () => {
  it("focuses Cancel, the safe choice, for a plain confirmation", async () => {
    render(<Modal open title="Delete" variant="destructive" />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    );
  });

  it("focuses the first field of a form, as v1's FormModal did", async () => {
    render(
      <Modal open title="Edit profile" confirmButtonText="Save">
        <input aria-label="Name" />
        <input aria-label="Email" />
      </Modal>
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
    );
  });

  it("focuses the phrase field for type-to-confirm even with a body", async () => {
    render(
      <Modal open title="Delete" requireText="DELETE">
        <p>Extra detail</p>
      </Modal>
    );
    await waitFor(() => expect(screen.getByRole("textbox")).toHaveFocus());
  });
});
