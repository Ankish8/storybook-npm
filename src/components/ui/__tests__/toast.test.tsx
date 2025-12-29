import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Toaster,
  toast,
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
} from "../toast";

describe("Toast", () => {
  beforeEach(() => {
    // Clear any existing toasts
    toast.dismiss();
  });

  afterEach(() => {
    // Clean up toasts after each test
    toast.dismiss();
  });

  describe("Toaster", () => {
    it("renders without crashing", () => {
      const { container } = render(<Toaster />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("toast function", () => {
    it("shows a basic toast message", async () => {
      render(<Toaster />);

      act(() => {
        toast({ title: "Hello World" });
      });

      await waitFor(() => {
        expect(screen.getByText("Hello World")).toBeInTheDocument();
      });
    });

    it("shows a toast with description", async () => {
      render(<Toaster />);

      act(() => {
        toast({
          title: "Title",
          description: "This is a description",
        });
      });

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument();
        expect(screen.getByText("This is a description")).toBeInTheDocument();
      });
    });

    it("shows a success toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.success({ title: "Success message" });
      });

      await waitFor(() => {
        expect(screen.getByText("Success message")).toBeInTheDocument();
      });
    });

    it("shows an error toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.error({ title: "Error message" });
      });

      await waitFor(() => {
        expect(screen.getByText("Error message")).toBeInTheDocument();
      });
    });

    it("shows a warning toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.warning({ title: "Warning message" });
      });

      await waitFor(() => {
        expect(screen.getByText("Warning message")).toBeInTheDocument();
      });
    });

    it("shows an info toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.info({ title: "Info message" });
      });

      await waitFor(() => {
        expect(screen.getByText("Info message")).toBeInTheDocument();
      });
    });

    it("dismisses a specific toast", async () => {
      render(<Toaster />);

      let toastResult: { id: string; dismiss: () => void };
      act(() => {
        toastResult = toast({ title: "Dismissable toast" });
      });

      await waitFor(() => {
        expect(screen.getByText("Dismissable toast")).toBeInTheDocument();
      });

      act(() => {
        toastResult.dismiss();
      });

      await waitFor(() => {
        expect(screen.queryByText("Dismissable toast")).not.toBeInTheDocument();
      });
    });

    it("dismisses all toasts", async () => {
      render(<Toaster />);

      act(() => {
        toast({ title: "Toast 1" });
        toast({ title: "Toast 2" });
      });

      await waitFor(() => {
        expect(screen.getByText("Toast 1")).toBeInTheDocument();
        expect(screen.getByText("Toast 2")).toBeInTheDocument();
      });

      act(() => {
        toast.dismiss();
      });

      await waitFor(() => {
        expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Toast 2")).not.toBeInTheDocument();
      });
    });

    it("shows toast with action button", async () => {
      render(<Toaster />);

      act(() => {
        toast({
          title: "Action toast",
          action: <ToastAction altText="Undo action">Undo</ToastAction>,
        });
      });

      await waitFor(() => {
        expect(screen.getByText("Action toast")).toBeInTheDocument();
        expect(screen.getByText("Undo")).toBeInTheDocument();
      });
    });

    it("returns toast id and control functions", () => {
      render(<Toaster />);

      let result: { id: string; dismiss: () => void; update: Function };
      act(() => {
        result = toast({ title: "Test toast" });
      });

      expect(result!.id).toBeDefined();
      expect(typeof result!.dismiss).toBe("function");
      expect(typeof result!.update).toBe("function");
    });
  });

  describe("Toast component", () => {
    it("renders with default variant", () => {
      render(
        <ToastProvider>
          <Toast data-testid="toast">Test Toast</Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId("toast")).toBeInTheDocument();
    });

    it("renders with success variant", () => {
      render(
        <ToastProvider>
          <Toast variant="success" data-testid="toast">
            Success Toast
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("bg-semantic-success-surface");
    });

    it("renders with error variant", () => {
      render(
        <ToastProvider>
          <Toast variant="error" data-testid="toast">
            Error Toast
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("bg-semantic-error-surface");
    });

    it("renders with warning variant", () => {
      render(
        <ToastProvider>
          <Toast variant="warning" data-testid="toast">
            Warning Toast
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("bg-semantic-warning-surface");
    });

    it("renders with info variant", () => {
      render(
        <ToastProvider>
          <Toast variant="info" data-testid="toast">
            Info Toast
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = screen.getByTestId("toast");
      expect(toast).toHaveClass("bg-semantic-info-surface");
    });

    it("applies custom className", () => {
      render(
        <ToastProvider>
          <Toast className="custom-class" data-testid="toast">
            Test
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId("toast")).toHaveClass("custom-class");
    });
  });

  describe("ToastTitle", () => {
    it("renders title text", () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText("Toast Title")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle className="custom-title" data-testid="title">
              Title
            </ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  describe("ToastDescription", () => {
    it("renders description text", () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastDescription>Toast Description</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText("Toast Description")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastDescription className="custom-desc" data-testid="desc">
              Description
            </ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });
  });

  describe("ToastAction", () => {
    it("renders action button", () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastAction altText="Test action">Click me</ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("handles click events", async () => {
      const user = userEvent.setup();
      let clicked = false;

      render(
        <ToastProvider>
          <Toast>
            <ToastAction altText="Test" onClick={() => (clicked = true)}>
              Click
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      await user.click(screen.getByText("Click"));
      expect(clicked).toBe(true);
    });
  });

  describe("ToastClose", () => {
    it("renders close button", () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastClose data-testid="close" />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId("close")).toBeInTheDocument();
    });
  });

  describe("toastVariants", () => {
    it("returns correct classes for default variant", () => {
      const classes = toastVariants({ variant: "default" });
      expect(classes).toContain("bg-semantic-bg-primary");
    });

    it("returns correct classes for success variant", () => {
      const classes = toastVariants({ variant: "success" });
      expect(classes).toContain("bg-semantic-success-surface");
    });

    it("returns correct classes for error variant", () => {
      const classes = toastVariants({ variant: "error" });
      expect(classes).toContain("bg-semantic-error-surface");
    });

    it("returns correct classes for warning variant", () => {
      const classes = toastVariants({ variant: "warning" });
      expect(classes).toContain("bg-semantic-warning-surface");
    });

    it("returns correct classes for info variant", () => {
      const classes = toastVariants({ variant: "info" });
      expect(classes).toContain("bg-semantic-info-surface");
    });
  });

  describe("ToastViewport", () => {
    it("renders viewport", () => {
      render(
        <ToastProvider>
          <ToastViewport data-testid="viewport" />
        </ToastProvider>
      );

      expect(screen.getByTestId("viewport")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ToastProvider>
          <ToastViewport className="custom-viewport" data-testid="viewport" />
        </ToastProvider>
      );

      expect(screen.getByTestId("viewport")).toHaveClass("custom-viewport");
    });
  });
});
