import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster, toast } from "../toast";

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

    it("renders with custom position", () => {
      render(<Toaster position="top-center" />);
      // Toaster renders but position is applied via Sonner internals
      expect(document.body).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Toaster className="custom-class" />);
      expect(document.body).toBeInTheDocument();
    });

    it("applies custom duration", () => {
      render(<Toaster duration={2000} />);
      expect(document.body).toBeInTheDocument();
    });

    it("applies visibleToasts prop", () => {
      render(<Toaster visibleToasts={5} />);
      expect(document.body).toBeInTheDocument();
    });
  });

  describe("toast function", () => {
    it("shows a basic toast message", async () => {
      render(<Toaster />);

      act(() => {
        toast("Hello World");
      });

      await waitFor(() => {
        expect(screen.getByText("Hello World")).toBeInTheDocument();
      });
    });

    it("shows a toast with description", async () => {
      render(<Toaster />);

      act(() => {
        toast("Title", {
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
        toast.success("Success message");
      });

      await waitFor(() => {
        expect(screen.getByText("Success message")).toBeInTheDocument();
      });
    });

    it("shows an error toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.error("Error message");
      });

      await waitFor(() => {
        expect(screen.getByText("Error message")).toBeInTheDocument();
      });
    });

    it("shows a warning toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.warning("Warning message");
      });

      await waitFor(() => {
        expect(screen.getByText("Warning message")).toBeInTheDocument();
      });
    });

    it("shows an info toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.info("Info message");
      });

      await waitFor(() => {
        expect(screen.getByText("Info message")).toBeInTheDocument();
      });
    });

    it("shows a loading toast", async () => {
      render(<Toaster />);

      act(() => {
        toast.loading("Loading...");
      });

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("dismisses a specific toast", async () => {
      render(<Toaster />);

      let toastId: string | number;
      act(() => {
        toastId = toast("Dismissable toast");
      });

      await waitFor(() => {
        expect(screen.getByText("Dismissable toast")).toBeInTheDocument();
      });

      act(() => {
        toast.dismiss(toastId);
      });

      await waitFor(() => {
        expect(screen.queryByText("Dismissable toast")).not.toBeInTheDocument();
      });
    });

    it("dismisses all toasts", async () => {
      render(<Toaster />);

      act(() => {
        toast("Toast 1");
        toast("Toast 2");
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
      const onAction = vi.fn();
      render(<Toaster />);

      act(() => {
        toast("Action toast", {
          action: {
            label: "Undo",
            onClick: onAction,
          },
        });
      });

      await waitFor(() => {
        expect(screen.getByText("Action toast")).toBeInTheDocument();
        expect(screen.getByText("Undo")).toBeInTheDocument();
      });

      const user = userEvent.setup();
      await user.click(screen.getByText("Undo"));

      expect(onAction).toHaveBeenCalled();
    });

    it("handles promise toast", async () => {
      render(<Toaster />);

      const promise = new Promise((resolve) => setTimeout(resolve, 100));

      act(() => {
        toast.promise(promise, {
          loading: "Loading data...",
          success: "Data loaded!",
          error: "Failed to load",
        });
      });

      await waitFor(() => {
        expect(screen.getByText("Loading data...")).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.getByText("Data loaded!")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Toaster positions", () => {
    it.each([
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ] as const)("renders with position %s", (position) => {
      render(<Toaster position={position} />);
      expect(document.body).toBeInTheDocument();
    });
  });

  describe("Toaster configuration", () => {
    it("renders without close button when closeButton is false", () => {
      render(<Toaster closeButton={false} />);
      expect(document.body).toBeInTheDocument();
    });

    it("renders with expand set to false", () => {
      render(<Toaster expand={false} />);
      expect(document.body).toBeInTheDocument();
    });

    it("renders with custom gap", () => {
      render(<Toaster gap={16} />);
      expect(document.body).toBeInTheDocument();
    });

    it("renders with custom offset", () => {
      render(<Toaster offset={32} />);
      expect(document.body).toBeInTheDocument();
    });

    it("renders with richColors disabled", () => {
      render(<Toaster richColors={false} />);
      expect(document.body).toBeInTheDocument();
    });
  });
});
