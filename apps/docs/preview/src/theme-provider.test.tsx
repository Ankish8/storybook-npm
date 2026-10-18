import * as React from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import userEvent from "@testing-library/user-event";
import { ThemeSwitch } from "../../components/theme-switch";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  ThemeControl,
  ThemeProvider,
  useDocsTheme,
} from "../../components/theme-provider";
import { THEME_KEY, type ThemeMode } from "../../lib/theme";

let systemDark = false;
let media: MediaQueryList;
beforeEach(() => {
  systemDark = false;
  const target = new EventTarget();
  media = {
    get matches() {
      return systemDark;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  } as MediaQueryList;
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) =>
      query.includes("prefers-color-scheme")
        ? media
        : { ...media, matches: false, media: query }
    )
  );
  localStorage.setItem(THEME_KEY, "system");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.className = "";
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themeMode;
  document.documentElement.style.colorScheme = "";
});
function ModeControls() {
  const { setMode } = useDocsTheme();
  return (
    <>
      {(["light", "dark", "system"] as const).map((mode) => (
        <button key={mode} onClick={() => setMode(mode)}>
          Set {mode}
        </button>
      ))}
    </>
  );
}
function App({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeControl />
      <ModeControls />
      {children}
    </ThemeProvider>
  );
}
function selectTheme(value: ThemeMode) {
  fireEvent.click(screen.getByRole("button", { name: `Set ${value}` }));
}
function expectTheme(value: "light" | "dark") {
  expect(document.documentElement.classList.contains("dark")).toBe(
    value === "dark"
  );
  expect(document.documentElement.dataset.theme).toBe(value);
  expect(document.documentElement.style.colorScheme).toBe(value);
}

test.each(["light", "dark", "system"] as const)(
  "restores the saved %s preference on mount",
  (mode) => {
    localStorage.setItem(THEME_KEY, mode);
    systemDark = true;
    render(<App />);
    expect(
      screen
        .getByRole("button", { name: /Switch to (light|dark) mode/ })
        .getAttribute("aria-pressed")
    ).toBe(String(mode === "system" || mode === "dark"));
    expect(document.documentElement.dataset.themeMode).toBe(mode);
    expectTheme(mode === "system" ? "dark" : mode);
  }
);

test("theme changes preserve interactive child state and persist the selected preference", () => {
  function Draft() {
    const [value, setValue] = React.useState("");
    return (
      <input
        aria-label="Draft"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  }
  render(
    <App>
      <Draft />
    </App>
  );
  const input = screen.getByRole("textbox") as HTMLInputElement;
  fireEvent.change(input, { target: { value: "Unsaved draft" } });
  selectTheme("dark");
  expectTheme("dark");
  expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  expect(screen.getByRole("textbox")).toBe(input);
  expect(input.value).toBe("Unsaved draft");
  selectTheme("light");
  expectTheme("light");
  expect(input.value).toBe("Unsaved draft");
});

test("system changes affect only System mode", () => {
  render(<App />);
  act(() => {
    systemDark = true;
    media.dispatchEvent(new Event("change"));
  });
  expectTheme("dark");
  selectTheme("light");
  act(() => {
    systemDark = false;
    media.dispatchEvent(new Event("change"));
    systemDark = true;
    media.dispatchEvent(new Event("change"));
  });
  expectTheme("light");
  selectTheme("system");
  expectTheme("dark");
});

test("an unavailable storage write does not prevent a session theme change", () => {
  localStorage.setItem(THEME_KEY, "light");
  render(<App />);
  const blockedWrite = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new DOMException("Quota", "QuotaExceededError");
    });
  selectTheme("dark");
  expectTheme("dark");
  expect(
    screen
      .getByRole("button", { name: "Switch to light mode" })
      .getAttribute("aria-pressed")
  ).toBe("true");
  // A later cross-tab preference must supersede the temporary in-memory choice.
  blockedWrite.mockRestore();
  act(() => {
    localStorage.setItem(THEME_KEY, "light");
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_KEY, newValue: "light" })
    );
  });
  expectTheme("light");
});

test("syncs cross-tab preference changes", () => {
  render(<App />);
  act(() => {
    localStorage.setItem(THEME_KEY, "dark");
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_KEY, newValue: "dark" })
    );
  });
  expectTheme("dark");
  expect(
    screen
      .getByRole("button", { name: "Switch to light mode" })
      .getAttribute("aria-pressed")
  ).toBe("true");
});

test("publishes themes on preference changes, authenticated readiness and load without navigating a preview", () => {
  const { getByTitle } = render(
    <App>
      <iframe
        title="Preview"
        src="https://preview.example.test/design-system/preview/index.html?component=button"
      />
      <iframe title="Unrelated" src="https://other.example.test/embed.html" />
    </App>
  );
  const frame = getByTitle("Preview") as HTMLIFrameElement;
  const unrelated = getByTitle("Unrelated") as HTMLIFrameElement;
  const originalSrc = frame.src;
  const post = vi.spyOn(frame.contentWindow!, "postMessage");
  const unrelatedPost = vi.spyOn(unrelated.contentWindow!, "postMessage");
  selectTheme("dark");
  expect(post).toHaveBeenLastCalledWith(
    { channel: "myoperator-v2-docs", type: "set-theme", theme: "dark" },
    "https://preview.example.test"
  );
  expect(unrelatedPost).not.toHaveBeenCalled();
  post.mockClear();
  act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: frame.contentWindow,
        origin: "https://preview.example.test",
        data: { channel: "myoperator-v2-docs", type: "ready" },
      })
    )
  );
  expect(post).toHaveBeenCalledTimes(1);
  post.mockClear();
  fireEvent.load(frame);
  expect(post).toHaveBeenCalledTimes(1);
  expect(frame.src).toBe(originalSrc);
  expect(getByTitle("Preview")).toBe(frame);
});

test.each([
  ["foreign origin", "https://spoof.example", "myoperator-v2-docs", false],
  [
    "foreign source",
    "https://preview.example.test",
    "myoperator-v2-docs",
    true,
  ],
  ["foreign channel", "https://preview.example.test", "spoof", false],
])(
  "ignores readiness from a %s",
  (_description, origin, channel, foreignSource) => {
    const { getByTitle } = render(
      <App>
        <iframe
          title="Preview"
          src="https://preview.example.test/preview/example.html"
        />
      </App>
    );
    const frame = getByTitle("Preview") as HTMLIFrameElement;
    const post = vi.spyOn(frame.contentWindow!, "postMessage");
    act(() =>
      window.dispatchEvent(
        new MessageEvent("message", {
          source: foreignSource ? window : frame.contentWindow,
          origin,
          data: { channel, type: "ready" },
        })
      )
    );
    expect(post).not.toHaveBeenCalled();
  }
);

test("new lazy preview frames receive the current theme through both load and ready after the provider mounted", () => {
  const app = render(<App />);
  selectTheme("dark");
  const frame = document.createElement("iframe");
  frame.src =
    "https://preview.example.test/design-system/preview/example.html?component=modal";
  document.body.append(frame);
  const src = frame.src;
  const post = vi.spyOn(frame.contentWindow!, "postMessage");
  fireEvent.load(frame);
  expect(post).toHaveBeenLastCalledWith(
    { channel: "myoperator-v2-docs", type: "set-theme", theme: "dark" },
    "https://preview.example.test"
  );
  post.mockClear();
  act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: frame.contentWindow,
        origin: "https://preview.example.test",
        data: { channel: "myoperator-v2-docs", type: "ready" },
      })
    )
  );
  expect(post).toHaveBeenCalledTimes(1);
  expect(frame.src).toBe(src);

  // A removed provider must not keep broadcasting a stale preference.
  app.unmount();
  post.mockClear();
  fireEvent.load(frame);
  act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: frame.contentWindow,
        origin: "https://preview.example.test",
        data: { channel: "myoperator-v2-docs", type: "ready" },
      })
    )
  );
  expect(post).not.toHaveBeenCalled();
  frame.remove();
});

test("the sun/moon switch replaces the dropdown and saves the opposite theme", () => {
  render(<App />);
  expect(screen.queryByRole("combobox")).toBeNull();
  const switcher = screen.getByRole("button", { name: "Switch to dark mode" });
  expect(switcher.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(switcher);
  expectTheme("dark");
  expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  expect(screen.getByRole("button", { name: "Switch to light mode" })).toBe(
    switcher
  );
  fireEvent.click(switcher);
  expectTheme("light");
  expect(localStorage.getItem(THEME_KEY)).toBe("light");
});

test("the switch supports Enter and Space without losing focus", async () => {
  const user = userEvent.setup();
  render(<App />);
  const switcher = screen.getByRole("button", { name: "Switch to dark mode" });
  await user.tab();
  expect(document.activeElement).toBe(switcher);
  await user.keyboard("{Enter}");
  expectTheme("dark");
  expect(document.activeElement).toBe(switcher);
  await user.keyboard(" ");
  expectTheme("light");
  expect(document.activeElement).toBe(switcher);
});

test("a dark preference hydrates the server-rendered switch without markup errors", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToString(
    <ThemeSwitch theme="light" onThemeChange={() => {}} />
  );
  document.body.append(host);
  document.documentElement.classList.add("dark");
  const errors = vi.spyOn(console, "error").mockImplementation(() => {});
  let root: Root | undefined;
  act(() => {
    root = hydrateRoot(
      host,
      <ThemeSwitch theme="dark" onThemeChange={() => {}} />
    );
  });
  expect(host.querySelector("button")?.getAttribute("aria-label")).toBe(
    "Switch to light mode"
  );
  expect(host.querySelector("button")?.getAttribute("aria-pressed")).toBe(
    "true"
  );
  expect(errors.mock.calls.flat().join(" ")).not.toMatch(
    /hydration|did not match|server rendered/i
  );
  act(() => root?.unmount());
  host.remove();
});

test("pointer switching keeps an in-progress field focused", async () => {
  const user = userEvent.setup();
  render(
    <App>
      <input aria-label="In-progress value" defaultValue="Keep this draft" />
    </App>
  );
  const input = screen.getByRole("textbox", { name: "In-progress value" });
  await user.click(input);
  await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expectTheme("dark");
  expect(document.activeElement).toBe(input);
  expect((input as HTMLInputElement).value).toBe("Keep this draft");
});
