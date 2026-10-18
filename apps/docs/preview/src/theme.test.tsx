import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { installPreviewTheme } from "./theme";
import { CHANNEL } from "./model.mjs";
import { THEME_KEY } from "../../lib/theme";

const parentOrigin = "https://docs.example.test";
let systemDark = false;
let media: MediaQueryList;
let registered: Array<[string, EventListenerOrEventListenerObject]>;
const parentDescriptor = Object.getOwnPropertyDescriptor(window, "parent");

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
    vi.fn(() => media)
  );
  window.history.replaceState(null, "", "/preview/index.html");
  localStorage.clear();
  document.documentElement.className = "";
  registered = [];
  const original = window.addEventListener.bind(window);
  vi.spyOn(window, "addEventListener").mockImplementation(
    (type, listener, options) => {
      registered.push([type, listener as EventListener]);
      original(type, listener, options);
    }
  );
});
afterEach(() => {
  registered.forEach(([type, listener]) =>
    window.removeEventListener(type, listener)
  );
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (parentDescriptor)
    Object.defineProperty(window, "parent", parentDescriptor);
  document.documentElement.className = "";
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = "";
  document.body.replaceChildren();
  localStorage.clear();
});

function send(theme: unknown, overrides: Partial<MessageEventInit> = {}) {
  window.dispatchEvent(
    new MessageEvent("message", {
      source: window.parent,
      origin: parentOrigin,
      data: { channel: CHANNEL, type: "set-theme", theme },
      ...overrides,
    })
  );
}
function expectTheme(theme: "light" | "dark") {
  expect(document.documentElement.classList.contains("dark")).toBe(
    theme === "dark"
  );
  expect(document.documentElement.dataset.theme).toBe(theme);
  expect(document.documentElement.style.colorScheme).toBe(theme);
}

test("a valid parent theme switches an existing interactive preview without replacing its content", () => {
  document.body.innerHTML =
    '<input aria-label="Draft" value="Unsaved content">';
  const input = document.querySelector("input")!;
  input.value = "User edited content";
  input.focus();
  installPreviewTheme(parentOrigin);
  send("dark");
  expectTheme("dark");
  expect(document.querySelector("input")).toBe(input);
  expect(input.value).toBe("User edited content");
  expect(document.activeElement).toBe(input);
  send("light");
  expectTheme("light");
  expect(input.value).toBe("User edited content");
});

test.each([
  ["foreign origin", { origin: "https://evil.example" }],
  ["foreign source", { source: {} as Window }],
  [
    "wrong channel",
    { data: { channel: "foreign", type: "set-theme", theme: "dark" } },
  ],
  [
    "wrong event type",
    { data: { channel: CHANNEL, type: "ready", theme: "dark" } },
  ],
  [
    "unsupported theme",
    { data: { channel: CHANNEL, type: "set-theme", theme: "system" } },
  ],
  [
    "non-string theme",
    { data: { channel: CHANNEL, type: "set-theme", theme: true } },
  ],
])("rejects %s", (_label, overrides) => {
  installPreviewTheme(parentOrigin);
  send("dark", overrides as Partial<MessageEventInit>);
  expectTheme("light");
});

test("the legacy v1 reference remains light despite stored, query and parent dark preferences", () => {
  localStorage.setItem(THEME_KEY, "dark");
  window.history.replaceState(null, "", "/preview/index.html?theme=dark");
  installPreviewTheme(parentOrigin, true);
  expectTheme("light");
  send("dark");
  expectTheme("light");
});

test("a direct preview query overrides the stored preference and ignores later system changes", () => {
  localStorage.setItem(THEME_KEY, "dark");
  window.history.replaceState(null, "", "/preview/example.html?theme=light");
  installPreviewTheme(parentOrigin);
  expectTheme("light");
  systemDark = true;
  media.dispatchEvent(new Event("change"));
  expectTheme("light");
});

test.each([null, "system", "invalid-saved-value"])(
  "a direct preview follows system changes when the saved preference is %s",
  (saved) => {
    if (saved !== null) localStorage.setItem(THEME_KEY, saved);
    installPreviewTheme(parentOrigin);
    expectTheme("light");
    systemDark = true;
    media.dispatchEvent(new Event("change"));
    expectTheme("dark");
  }
);

test("a preview with blocked storage still accepts authenticated parent changes", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Blocked", "SecurityError");
  });
  installPreviewTheme(parentOrigin);
  send("dark");
  expectTheme("dark");
});

test("an embedded preview follows its parent preference rather than independently following OS changes", () => {
  const parent = {} as Window;
  Object.defineProperty(window, "parent", {
    configurable: true,
    value: parent,
  });
  installPreviewTheme(parentOrigin);
  send("light");
  systemDark = true;
  media.dispatchEvent(new Event("change"));
  expectTheme("light");
  send("dark");
  expectTheme("dark");
});
