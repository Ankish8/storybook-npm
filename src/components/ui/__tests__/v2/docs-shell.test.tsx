import * as React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentPlayground } from "../../../../../apps/docs/components/component-playground";
import { LibraryShell } from "../../../../../apps/docs/components/library-shell";

const routing = vi.hoisted(() => ({
  pathname: "/components/button",
  push: vi.fn(),
}));
vi.mock("../../../../../apps/docs/node_modules/next/navigation.js", () => ({
  usePathname: () => routing.pathname,
  useRouter: () => ({ push: routing.push }),
}));
vi.mock("../../../../../apps/docs/node_modules/next/link.js", () => ({
  default: ({
    prefetch,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    prefetch?: boolean;
  }) => <a {...props} />,
}));
// Exercise the shell's state/protocol separately from the Radix control. The
// actual control and native keyboard interactions are also checked in Chrome.
vi.mock("../../../../../apps/docs/components/docs-select", () => ({
  DocsSelect: ({
    label,
    value,
    onValueChange,
    options,
    id,
    disabled,
  }: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    id?: string;
    disabled?: boolean;
  }) => (
    <select
      id={id}
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const originalScrollTo = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollTo"
);
const originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");
beforeEach(() => {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: {
      ready: Promise.resolve(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  window.matchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  routing.pathname = "/components/button";
  window.history.replaceState(null, "", "/components/button");
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    configurable: true,
    value: vi.fn(),
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  document.body.style.overflow = "";
  if (originalScrollTo)
    Object.defineProperty(HTMLElement.prototype, "scrollTo", originalScrollTo);
  else Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
  if (originalFonts) Object.defineProperty(document, "fonts", originalFonts);
  else Reflect.deleteProperty(document, "fonts");
});

function preview() {
  return screen.getByTitle("Button interactive preview") as HTMLIFrameElement;
}
function reply(
  frame: HTMLIFrameElement,
  data: Record<string, unknown>,
  origin = new URL(frame.src).origin
) {
  act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: frame.contentWindow,
        origin,
        data: { channel: "myoperator-v2-docs", component: "button", ...data },
      })
    )
  );
}
function metadata(frame: HTMLIFrameElement, options = { enabled: true }) {
  const story = new URL(frame.src).searchParams.get("story")!;
  reply(frame, {
    type: "metadata",
    story,
    stories: [
      { id: story, name: story },
      { id: "Second", name: "Second example" },
    ],
    args: { options },
    argTypes: { options: { name: "Options", control: "object" } },
  });
  return story;
}

describe("shared docs shell state", () => {
  it("returns focus to the menu button after mobile Escape and removes inert", () => {
    render(
      <LibraryShell>
        <p>Page</p>
      </LibraryShell>
    );
    const menu = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(menu);
    expect(
      screen.getByRole("searchbox", { name: "Filter components" })
    ).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(menu).toHaveFocus();
    expect(document.getElementById("arc-navigation")).toHaveAttribute(
      "data-open",
      "false"
    );
    expect(document.querySelector("header")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("");
  });
  it("keeps invalid JSON during unchanged external updates and resets changed values without losing focus", () => {
    render(<ComponentPlayground slug="button" title="Button" />);
    const frame = preview();
    const story = metadata(frame);
    fireEvent.click(screen.getByRole("button", { name: "Customize" }));
    const field = screen.getByLabelText("Options");
    field.focus();
    fireEvent.change(field, { target: { value: "{" } });
    expect(screen.getByText("Enter valid JSON.")).toBeInTheDocument();
    reply(frame, {
      type: "args-updated",
      story,
      args: { options: { enabled: true } },
    });
    expect(field).toHaveValue("{");
    expect(screen.getByText("Enter valid JSON.")).toBeInTheDocument();
    reply(frame, {
      type: "args-updated",
      story,
      args: { options: { enabled: false } },
    });
    expect(screen.getByLabelText("Options")).toBe(field);
    expect(field).toHaveFocus();
    expect(field).toHaveValue(JSON.stringify({ enabled: false }, null, 2));
    expect(screen.queryByText("Enter valid JSON.")).not.toBeInTheDocument();
  });

  it("posts valid JSON edits and retains the same focused control after acknowledgement", () => {
    render(<ComponentPlayground slug="button" title="Button" />);
    const frame = preview();
    const story = metadata(frame);
    const post = vi.spyOn(frame.contentWindow!, "postMessage");
    fireEvent.click(screen.getByRole("button", { name: "Customize" }));
    const field = screen.getByLabelText("Options");
    field.focus();
    fireEvent.change(field, { target: { value: '{"count":2}' } });
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "update-args",
        args: { options: { count: 2 } },
      }),
      new URL(frame.src).origin
    );
    reply(frame, {
      type: "args-updated",
      story,
      args: { options: { count: 2 } },
    });
    expect(screen.getByLabelText("Options")).toBe(field);
    expect(field).toHaveFocus();
  });

  it("preserves deep-linked stories and does not reload the iframe when selecting another story", () => {
    window.history.replaceState(
      null,
      "",
      "/components/button?example=DeepLink"
    );
    render(<ComponentPlayground slug="button" title="Button" />);
    const frame = preview();
    const initialSrc = frame.src;
    expect(new URL(initialSrc).searchParams.get("story")).toBe("DeepLink");
    metadata(frame);
    const post = vi.spyOn(frame.contentWindow!, "postMessage");
    fireEvent.click(screen.getByRole("button", { name: "Customize" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Example" }), {
      target: { value: "Second" },
    });
    expect(new URL(window.location.href).searchParams.get("example")).toBe(
      "Second"
    );
    expect(preview()).toBe(frame);
    expect(frame.src).toBe(initialSrc);
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({ type: "select-story", story: "Second" }),
      new URL(frame.src).origin
    );
    reply(frame, {
      type: "metadata",
      story: "DeepLink",
      stories: [],
      args: {},
      argTypes: {},
    });
    expect(screen.getByRole("combobox", { name: "Example" })).toHaveValue(
      "Second"
    );
  });

  it("uses the configured preview origin and rejects messages from the wrong origin or sender", () => {
    vi.stubEnv("NEXT_PUBLIC_PREVIEW_ORIGIN", "http://127.0.0.1:6011");
    render(<ComponentPlayground slug="button" title="Button" />);
    const frame = preview();
    expect(new URL(frame.src).origin).toBe("http://127.0.0.1:6011");
    expect(new URL(frame.src).searchParams.get("parentOrigin")).toBe(
      window.location.origin
    );
    reply(
      frame,
      { type: "error", message: "Wrong origin" },
      window.location.origin
    );
    act(() =>
      window.dispatchEvent(
        new MessageEvent("message", {
          source: window,
          origin: "http://127.0.0.1:6011",
          data: {
            channel: "myoperator-v2-docs",
            component: "button",
            type: "error",
            message: "Wrong sender",
          },
        })
      )
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    metadata(frame);
    expect(screen.queryByText("Loading Button…")).not.toBeInTheDocument();
  });

  it("does not display stale source after changing source mode or accept an aborted response", async () => {
    const requests: {
      signal: AbortSignal;
      resolve: (response: Pick<Response, "ok" | "json">) => void;
    }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, options: RequestInit) =>
          new Promise((resolve) => {
            requests.push({ signal: options.signal as AbortSignal, resolve });
          })
      )
    );
    render(<ComponentPlayground slug="button" title="Button" />);
    fireEvent.click(screen.getByRole("tab", { name: "Code" }));
    expect(screen.getByText("Loading source…")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Source file" }), {
      target: { value: "story" },
    });
    expect(requests[0].signal.aborted).toBe(true);
    await act(async () =>
      requests[0].resolve({
        ok: true,
        json: async () => ({ source: "Old component", filename: "button.tsx" }),
      })
    );
    expect(screen.queryByText("Old component")).not.toBeInTheDocument();
    await act(async () =>
      requests[1].resolve({
        ok: true,
        json: async () => ({
          source: "Latest story",
          filename: "button.stories.tsx",
        }),
      })
    );
    expect(screen.getByText("Latest story")).toBeInTheDocument();
    expect(screen.getByText("button.stories.tsx")).toBeInTheDocument();
  });

  it("clears mobile navigation and opens the destination category while preserving other collapsed groups", () => {
    const view = render(
      <LibraryShell>
        <p>Page</p>
      </LibraryShell>
    );
    const forms = document.querySelector('[aria-controls="arc-group-forms"]')!;
    const feedback = document.querySelector(
      '[aria-controls="arc-group-feedback"]'
    )!;
    fireEvent.click(forms);
    fireEvent.click(feedback);
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(document.getElementById("arc-navigation")).toHaveAttribute(
      "data-open",
      "true"
    );
    expect(document.body.style.overflow).toBe("hidden");
    routing.pathname = "/components/input";
    view.rerender(
      <LibraryShell>
        <p>Next page</p>
      </LibraryShell>
    );
    expect(document.getElementById("arc-navigation")).toHaveAttribute(
      "data-open",
      "false"
    );
    expect(document.body.style.overflow).toBe("");
    expect(forms).toHaveAttribute("aria-expanded", "true");
    expect(feedback).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "Input" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});
