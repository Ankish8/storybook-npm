import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { EmptyState } from "../../v2/empty-state";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

const preference = vi.hoisted(() => ({ reduce: false }));
const originalMatchMedia = window.matchMedia;
vi.spyOn(window, "matchMedia").mockImplementation((query) => {
  if (query !== "(prefers-reduced-motion: reduce)")
    return originalMatchMedia(query);
  return {
    get matches() {
      return preference.reduce;
    },
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => true,
  };
});

beforeEach(() => {
  preference.reduce = false;
});

describe("EmptyState", () => {
  it("renders title correctly", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters."
      />
    );
    expect(screen.getByText("Try adjusting your filters.")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    const { queryByText } = render(<EmptyState title="No results" />);
    expect(queryByText("Try adjusting your filters.")).not.toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <EmptyState
        title="No results"
        icon={<span data-testid="icon">icon</span>}
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render icon container when icon is omitted", () => {
    const { container } = render(<EmptyState title="No results" />);
    expect(container.querySelector(".size-\\[90px\\]")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <EmptyState title="No results" actions={<button>Take action</button>} />
    );
    expect(
      screen.getByRole("button", { name: "Take action" })
    ).toBeInTheDocument();
  });

  it("does not render actions container when actions is omitted", () => {
    const { queryByRole } = render(<EmptyState title="No results" />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies custom className to root container", () => {
    const { container } = render(
      <EmptyState title="No results" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("sets data-slot attribute on root element", () => {
    const { container } = render(<EmptyState title="No results" />);
    expect(container.firstChild).toHaveAttribute("data-slot", "empty-state");
  });

  it("renders ReactNode as title", () => {
    render(
      <EmptyState
        title={<strong data-testid="title-node">Bold Title</strong>}
      />
    );
    expect(screen.getByTestId("title-node")).toBeInTheDocument();
  });

  it("renders ReactNode as description", () => {
    render(
      <EmptyState
        title="Title"
        description={<em data-testid="desc-node">Italic desc</em>}
      />
    );
    expect(screen.getByTestId("desc-node")).toBeInTheDocument();
  });

  it("does not constrain description width with max-w-xs", () => {
    render(
      <EmptyState title="No results" description="Long description text" />
    );
    expect(screen.getByText("Long description text")).not.toHaveClass(
      "max-w-xs"
    );
  });

  it("forwards its ref and native labeling, styles and event handlers", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    const { container } = render(
      <EmptyState
        ref={ref}
        id="contacts-empty"
        title="No contacts"
        role="region"
        aria-label="Contact search results"
        style={{ minHeight: 240 }}
        onClick={onClick}
      />
    );
    const region = screen.getByRole("region", {
      name: "Contact search results",
    });
    expect(ref.current).toBe(container.firstChild);
    expect(region).toHaveAttribute("id", "contacts-empty");
    expect(region).toHaveStyle({ minHeight: "240px" });
    await userEvent.click(region);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps caller supplied actions keyboard accessible without stealing focus", async () => {
    const clear = vi.fn();
    const help = vi.fn();
    render(
      <EmptyState
        illustration="no-results"
        title="No contacts"
        actions={
          <>
            <button onClick={clear}>Clear search</button>
            <button onClick={help}>Search help</button>
          </>
        }
      />
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Clear search" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(clear).toHaveBeenCalledOnce();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Search help" })).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(help).toHaveBeenCalledOnce();
  });

  it("resets Bootstrap paragraph margins for title and description", () => {
    const { container } = render(
      <EmptyState title="No contacts" description="Try a different name." />
    );
    assertNoBootstrapMarginBleed(container);
  });
});

describe("EmptyState illustrations", () => {
  it.each(["no-results", "offline", "caught-up", "not-found"] as const)(
    "renders the %s preset as decorative, unfocusable vector art",
    (illustration) => {
      const { container } = render(
        <EmptyState illustration={illustration} title="Nothing here" />
      );
      const art = container.querySelector(
        "[data-slot='empty-state-illustration']"
      );
      expect(art).toHaveAttribute("data-illustration", illustration);
      expect(art).toHaveAttribute("aria-hidden", "true");
      expect(art).toHaveAttribute("focusable", "false");
      expect(art?.querySelector("path")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    }
  );

  it("preserves a supplied icon's content and semantics over a preset", () => {
    const { container } = render(
      <EmptyState
        illustration="offline"
        title="Offline"
        icon={<svg role="img" aria-label="Custom sync indicator" />}
      />
    );
    expect(
      screen.getByRole("img", { name: "Custom sync indicator" })
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='empty-state-illustration']")
    ).not.toBeInTheDocument();
  });

  it("shows the artwork immediately without travel under reduced motion", () => {
    preference.reduce = true;
    const { container, rerender } = render(
      <EmptyState illustration="offline" title="Offline" />
    );
    const art = container.querySelector("svg") as SVGSVGElement;
    expect(art.style.opacity).toBe("1");
    expect(art.style.transform).toBe("none");
    rerender(<EmptyState illustration="caught-up" title="Caught up" />);
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-illustration",
      "caught-up"
    );
  });
});

describe("EmptyState size", () => {
  const DEFAULT_ROOT =
    "flex flex-col items-center justify-center gap-5 p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]";

  it("leaves the default output unchanged", () => {
    const { container: omitted } = render(
      <EmptyState icon={<svg />} title="Nothing" description="Details" />
    );
    const { container: explicit } = render(
      <EmptyState
        size="default"
        icon={<svg />}
        title="Nothing"
        description="Details"
      />
    );
    expect(omitted.innerHTML).toBe(explicit.innerHTML);
    expect((omitted.firstChild as HTMLElement).className).toBe(DEFAULT_ROOT);
    expect(omitted.querySelector("p")).toHaveClass("text-2xl", "leading-8");
    // svg -> crossfade slot -> tile
    expect(
      omitted.querySelector("svg")?.parentElement?.parentElement
    ).toHaveClass("size-[90px]");
  });

  it("matches Arc's empty state for sm", () => {
    const { container } = render(
      <EmptyState
        size="sm"
        icon={<svg />}
        title="Nothing"
        description="Details"
      />
    );
    // 20px between icon, copy and actions; vertical padding clamp(32px, 8vw, 48px) with 20px sides.
    expect(container.firstChild).toHaveClass(
      "gap-5",
      "px-5",
      "py-[clamp(2rem,8vw,3rem)]"
    );
    expect(container.firstChild).not.toHaveClass("p-6");
    const tile = container.querySelector("svg")?.parentElement
      ?.parentElement as HTMLElement;
    expect(tile).toHaveClass("size-12", "[&>span>svg]:size-6");
    expect(tile).not.toHaveClass("size-[90px]");
    expect(screen.getByText("Nothing").closest("p")).toHaveClass(
      "text-base",
      "leading-[1.1]",
      "tracking-[-0.03em]"
    );
    expect(screen.getByText("Details").closest("p")).toHaveClass(
      "text-sm",
      "leading-[1.4]",
      "max-w-[18rem]"
    );
  });

  it("hides the outgoing copy from assistive tech while a new title swaps in", () => {
    const { rerender } = render(<EmptyState title="Nothing yet" />);
    rerender(<EmptyState title="All clear" />);
    expect(screen.getByText("All clear")).not.toHaveAttribute("aria-hidden");
    const old = screen.queryByText("Nothing yet");
    if (old) expect(old).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps a custom className on both sizes", () => {
    const { container } = render(
      <EmptyState size="sm" title="Nothing" className="custom" />
    );
    expect(container.firstChild).toHaveClass("custom", "px-5");
  });
});
