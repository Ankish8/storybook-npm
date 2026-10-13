import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { Panel } from "../../v2/panel";

describe("Panel", () => {
  it("renders with title and children", () => {
    render(
      <Panel title="Details">
        <p className="m-0">Panel content</p>
      </Panel>
    );
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("renders with custom header replacing the default", () => {
    render(
      <Panel
        title="Should Not Appear"
        header={<div data-testid="custom-header">Custom Header</div>}
      >
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
    expect(screen.queryByText("Should Not Appear")).not.toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Panel title="Test" footer={<button>Save</button>}>
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Panel title="Closable" onClose={handleClose}>
        <p className="m-0">Body</p>
      </Panel>
    );
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("hides panel when open=false (w-0 class)", () => {
    const { container } = render(
      <Panel open={false} title="Hidden">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveClass("w-0");
    expect(container.firstChild).toHaveClass("border-l-0");
  });

  it("shows panel when open=true with width class", () => {
    const { container } = render(
      <Panel open={true} title="Visible">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveClass("w-[320px]");
    expect(container.firstChild).not.toHaveClass("w-0");
  });

  it.each([
    ["sm", "w-[280px]"],
    ["default", "w-[320px]"],
    ["lg", "w-[400px]"],
  ] as const)(
    "applies correct width class for size=%s",
    (size, expectedClass) => {
      const { container } = render(
        <Panel open={true} size={size} title="Sized">
          <p className="m-0">Body</p>
        </Panel>
      );
      expect(container.firstChild).toHaveClass(expectedClass);
    }
  );

  it("applies custom className", () => {
    const { container } = render(
      <Panel className="my-custom-class" title="Custom">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Panel ref={ref} title="Ref Test">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("ASIDE");
  });

  it("renders children in scrollable body", () => {
    const { container } = render(
      <Panel title="Scroll">
        <p className="m-0">Child content</p>
      </Panel>
    );
    const body = container.querySelector(".overflow-y-auto");
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent("Child content");
  });

  it("spreads data-testid and other props", () => {
    render(
      <Panel data-testid="my-panel" aria-label="Side panel" title="Props">
        <p className="m-0">Body</p>
      </Panel>
    );
    const panel = screen.getByTestId("my-panel");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute("aria-label", "Side panel");
  });

  // --- Accessibility tests ---

  it("renders as aside element", () => {
    const { container } = render(
      <Panel title="A11y Panel">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toBeInstanceOf(HTMLElement);
    expect((container.firstChild as HTMLElement).tagName).toBe("ASIDE");
  });

  it("has aria-label matching title", () => {
    const { container } = render(
      <Panel title="Contact Details">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveAttribute(
      "aria-label",
      "Contact Details"
    );
  });

  it("has aria-hidden when closed", () => {
    const { container } = render(
      <Panel open={false} title="Hidden Panel">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("does not have aria-hidden when open", () => {
    const { container } = render(
      <Panel open={true} title="Visible Panel">
        <p className="m-0">Body</p>
      </Panel>
    );
    expect(container.firstChild).toHaveAttribute("aria-hidden", "false");
  });

  it("calls onClose on Escape key", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Panel title="Escape Panel" onClose={handleClose}>
        <p className="m-0">Body</p>
      </Panel>
    );
    fireEvent.keyDown(container.firstChild as HTMLElement, {
      key: "Escape",
    });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("close button has aria-label", () => {
    render(
      <Panel title="Close Label" onClose={() => {}}>
        <p className="m-0">Body</p>
      </Panel>
    );
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("aria-label", "Close");
  });
});

it("returns focus to the opener and makes closed controls inert", () => {
  const opener = document.createElement("button");
  document.body.append(opener);
  opener.focus();
  const { rerender, container } = render(
    <Panel title="Details">
      <button>Save</button>
    </Panel>
  );
  expect(container.querySelector('[tabindex="-1"]')).toHaveFocus();
  rerender(
    <Panel open={false} title="Details">
      <button>Save</button>
    </Panel>
  );
  expect(opener).toHaveFocus();
  expect(screen.getByText("Save").parentElement?.parentElement).toHaveAttribute(
    "inert"
  );
  opener.remove();
});

it("lets consumers handle Escape before closing", () => {
  const close = vi.fn();
  const { container } = render(
    <Panel
      title="Details"
      onClose={close}
      onKeyDown={(event) => event.preventDefault()}
    />
  );
  fireEvent.keyDown(container.firstChild!, { key: "Escape" });
  expect(close).not.toHaveBeenCalled();
});

describe("Panel keyboard ownership", () => {
  it("ignores Escape while closed", () => {
    const close = vi.fn();
    const keyDown = vi.fn();
    const { container } = render(
      <Panel open={false} onClose={close} onKeyDown={keyDown} />
    );
    fireEvent.keyDown(container.firstChild!, { key: "Escape" });
    expect(keyDown).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
  });

  it("honors Escape consumed by a child control", () => {
    const close = vi.fn();
    render(
      <Panel onClose={close}>
        <input
          aria-label="Search"
          onKeyDown={(event) => event.preventDefault()}
        />
      </Panel>
    );
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
    expect(close).not.toHaveBeenCalled();
  });

  it("honors cancellation in native capture handlers", () => {
    const close = vi.fn();
    render(
      <Panel
        onClose={close}
        onKeyDownCapture={(event) => event.preventDefault()}
      >
        <button>Action</button>
      </Panel>
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Action" }), {
      key: "Escape",
    });
    expect(close).not.toHaveBeenCalled();
  });

  it("closes only the nearest nested panel", () => {
    const outerClose = vi.fn();
    const innerClose = vi.fn();
    render(
      <Panel title="Outer" onClose={outerClose}>
        <Panel title="Inner" onClose={innerClose}>
          <button>Inner action</button>
        </Panel>
      </Panel>
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Inner action" }), {
      key: "Escape",
    });
    expect(innerClose).toHaveBeenCalledTimes(1);
    expect(outerClose).not.toHaveBeenCalled();
  });

  it("does not dismiss an outer panel through a non-closable nested panel", () => {
    const close = vi.fn();
    render(
      <Panel onClose={close}>
        <Panel title="Inner">
          <input aria-label="Inner field" />
        </Panel>
      </Panel>
    );
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
    expect(close).not.toHaveBeenCalled();
  });

  it("ignores Escape from a portaled child while forwarding native handlers", () => {
    const close = vi.fn();
    const keyDown = vi.fn();
    render(
      <Panel onClose={close} onKeyDown={keyDown}>
        {createPortal(<button>Popup action</button>, document.body)}
      </Panel>
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Popup action" }), {
      key: "Escape",
    });
    expect(keyDown).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
  });

  it("does not dismiss while an IME composition is active", () => {
    const close = vi.fn();
    const { container } = render(<Panel onClose={close} />);
    fireEvent.keyDown(container.firstChild!, {
      key: "Escape",
      isComposing: true,
    });
    expect(close).not.toHaveBeenCalled();
  });

  it("leaves ordinary keys and Escape outside the panel alone", () => {
    const close = vi.fn();
    const { container } = render(<Panel onClose={close} />);
    fireEvent.keyDown(container.firstChild!, { key: "Enter" });
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(close).not.toHaveBeenCalled();
  });
});

describe("Panel form and native semantics", () => {
  it("keeps open controlled and does not submit a surrounding form on close", () => {
    const close = vi.fn();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Panel title="Details" onClose={close} />
      </form>
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(close).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
    expect(
      screen.getByRole("complementary", { name: "Details" })
    ).toHaveAttribute("aria-hidden", "false");
  });

  it("allows a native click capture handler to cancel the close action", () => {
    const close = vi.fn();
    render(
      <Panel
        onClose={close}
        onClickCapture={(event) => event.preventDefault()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(close).not.toHaveBeenCalled();
  });

  it("preserves native attributes, styles, events and the aside ref", () => {
    const ref = React.createRef<HTMLElement>();
    const click = vi.fn();
    render(
      <Panel
        ref={ref}
        id="contact"
        dir="rtl"
        tabIndex={0}
        data-state="custom"
        style={{ height: 300 }}
        onClick={click}
        aria-describedby="help"
      >
        <button>Details</button>
      </Panel>
    );
    expect(ref.current?.tagName).toBe("ASIDE");
    expect(ref.current).toHaveAttribute("id", "contact");
    expect(ref.current).toHaveAttribute("dir", "rtl");
    expect(ref.current).toHaveAttribute("tabindex", "0");
    expect(ref.current).toHaveAttribute("data-state", "custom");
    expect(ref.current).toHaveAttribute("aria-describedby", "help");
    expect(ref.current).toHaveStyle({ height: "300px" });
    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("supports callback refs and clears them on unmount", () => {
    const ref = vi.fn();
    const { unmount } = render(<Panel ref={ref} />);
    expect(ref).toHaveBeenLastCalledWith(expect.any(HTMLElement));
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  it("keeps the closed root inert even with native tabIndex and aria-hidden overrides", () => {
    const { container, rerender } = render(
      <Panel open={false} tabIndex={0} aria-hidden={false}>
        <button>Save</button>
      </Panel>
    );
    expect(container.firstChild).toHaveAttribute("inert");
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    rerender(
      <Panel open tabIndex={0} aria-hidden={false}>
        <button>Save</button>
      </Panel>
    );
    expect(container.firstChild).not.toHaveAttribute("inert");
    expect(container.firstChild).toHaveAttribute("aria-hidden", "false");
  });

  it("keeps contextual aside semantics and allows focus to leave", () => {
    const { container } = render(
      <>
        <Panel title="Details">
          <button>Panel action</button>
        </Panel>
        <button>Workspace action</button>
      </>
    );
    expect(
      screen.getByRole("complementary", { name: "Details" })
    ).not.toHaveAttribute("aria-modal");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(container.querySelector("aside")).not.toHaveAttribute("role");
    const workspace = screen.getByRole("button", { name: "Workspace action" });
    workspace.focus();
    fireEvent.keyDown(workspace, { key: "Tab" });
    expect(workspace).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("preserves a consumer's native inert attribute while open", () => {
    const { container, rerender } = render(
      <>
        <button autoFocus>Opener</button>
        <Panel inert title="Unavailable" />
      </>
    );
    expect(container.querySelector("aside")).toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: "Opener" })).toHaveFocus();
    rerender(
      <>
        <button>Opener</button>
        <Panel inert open={false} title="Unavailable" />
      </>
    );
    rerender(
      <>
        <button>Opener</button>
        <Panel inert title="Unavailable" />
      </>
    );
    expect(container.querySelector("aside")).toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: "Opener" })).toHaveFocus();
  });

  it("retains child state while collapsed", () => {
    const { rerender } = render(
      <Panel>
        <input aria-label="Note" defaultValue="Draft" />
      </Panel>
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Updated draft" } });
    rerender(
      <Panel open={false}>
        <input aria-label="Note" defaultValue="Draft" />
      </Panel>
    );
    rerender(
      <Panel>
        <input aria-label="Note" defaultValue="Draft" />
      </Panel>
    );
    expect(screen.getByRole("textbox")).toHaveValue("Updated draft");
  });
});

describe("Panel focus lifecycle", () => {
  it("respects an auto-focused child instead of replacing its focus", () => {
    render(
      <Panel>
        <input aria-label="Contact name" autoFocus />
      </Panel>
    );
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("does not autofocus a panel hidden through native attributes", () => {
    render(
      <>
        <button autoFocus>Opener</button>
        <Panel hidden>
          <button>Hidden action</button>
        </Panel>
      </>
    );
    expect(screen.getByRole("button", { name: "Opener" })).toHaveFocus();
  });

  it("does not autofocus a panel explicitly hidden from assistive technology", () => {
    render(
      <>
        <button autoFocus>Opener</button>
        <Panel aria-hidden="true">
          <button>Hidden action</button>
        </Panel>
      </>
    );
    expect(screen.getByRole("button", { name: "Opener" })).toHaveFocus();
  });

  it("returns focus when the aside itself owns focus", () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();
    const { rerender, container } = render(<Panel tabIndex={0} />);
    (container.firstChild as HTMLElement).focus();
    rerender(<Panel open={false} tabIndex={0} />);
    expect(opener).toHaveFocus();
    opener.remove();
  });

  it("does not steal focus that was deliberately moved outside before closing", () => {
    const { rerender } = render(
      <>
        <button autoFocus>Opener</button>
        <Panel>
          <button>Panel action</button>
        </Panel>
        <button>Workspace action</button>
      </>
    );
    const workspace = screen.getByRole("button", { name: "Workspace action" });
    workspace.focus();
    rerender(
      <>
        <button>Opener</button>
        <Panel open={false}>
          <button>Panel action</button>
        </Panel>
        <button>Workspace action</button>
      </>
    );
    expect(workspace).toHaveFocus();
  });

  it("captures the current opener each time the panel reopens", () => {
    const { rerender } = render(
      <>
        <button>First opener</button>
        <button>Second opener</button>
        <Panel open={false} />
      </>
    );
    const first = screen.getByRole("button", { name: "First opener" });
    const second = screen.getByRole("button", { name: "Second opener" });
    first.focus();
    rerender(
      <>
        <button>First opener</button>
        <button>Second opener</button>
        <Panel />
      </>
    );
    rerender(
      <>
        <button>First opener</button>
        <button>Second opener</button>
        <Panel open={false} />
      </>
    );
    expect(first).toHaveFocus();
    second.focus();
    rerender(
      <>
        <button>First opener</button>
        <button>Second opener</button>
        <Panel />
      </>
    );
    rerender(
      <>
        <button>First opener</button>
        <button>Second opener</button>
        <Panel open={false} />
      </>
    );
    expect(second).toHaveFocus();
  });

  it("returns focus on unmount only when it still owns it", () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();
    const { unmount } = render(
      <Panel>
        <button>Panel action</button>
      </Panel>
    );
    screen.getByRole("button", { name: "Panel action" }).focus();
    unmount();
    expect(opener).toHaveFocus();
    opener.remove();
  });

  it("does not try to return focus into a hidden opener", () => {
    const opener = document.createElement("button");
    document.body.append(opener);
    opener.focus();
    const focus = vi.spyOn(opener, "focus");
    const { rerender } = render(<Panel />);
    opener.hidden = true;
    rerender(<Panel open={false} />);
    expect(focus).not.toHaveBeenCalled();
    opener.remove();
  });
});

it("preserves cleanup-returning callback refs", () => {
  const calls: string[] = [];
  const ref = (node: HTMLElement | null) => {
    calls.push(node ? "attach" : "null");
    if (node)
      return () => {
        calls.push("cleanup");
      };
  };
  const { unmount } = render(<Panel ref={ref} title="Details" />);
  unmount();
  expect(calls).toEqual(["attach", "cleanup"]);
});
