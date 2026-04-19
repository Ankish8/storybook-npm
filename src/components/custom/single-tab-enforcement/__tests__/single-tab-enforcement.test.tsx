import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

import { SingleTabEnforcement } from "../single-tab-enforcement";
import { assertNoBootstrapMarginBleed } from "../../../ui/__tests__/utils/bootstrap-compat";

describe("SingleTabEnforcement", () => {
  it("renders default title, description, and action", () => {
    render(<SingleTabEnforcement onUseHereClick={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: "Session active in another tab" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The chat is open in another tab. Switch to that tab to continue the conversation."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use here" })).toBeInTheDocument();
  });

  it("calls onUseHereClick when the button is pressed", () => {
    const onUseHereClick = vi.fn();
    render(<SingleTabEnforcement onUseHereClick={onUseHereClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Use here" }));
    expect(onUseHereClick).toHaveBeenCalledTimes(1);
  });

  it("when openModalOnAction, opens modal first and calls onUseHereClick from the modal button", () => {
    const onUseHereClick = vi.fn();
    const onModalOpenChange = vi.fn();
    render(
      <SingleTabEnforcement
        openModalOnAction
        onUseHereClick={onUseHereClick}
        onModalOpenChange={onModalOpenChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Use here" }));
    expect(onUseHereClick).not.toHaveBeenCalled();
    expect(onModalOpenChange).toHaveBeenCalledWith(true);
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Use here" }));
    expect(onUseHereClick).toHaveBeenCalledTimes(1);
  });

  it("uses primary button styling", () => {
    render(<SingleTabEnforcement onUseHereClick={vi.fn()} />);
    const btn = screen.getByRole("button", { name: "Use here" });
    expect(btn.className).toContain("bg-semantic-primary");
  });

  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<SingleTabEnforcement ref={ref} onUseHereClick={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className onto the root", () => {
    const { container } = render(
      <SingleTabEnforcement
        className="my-notice"
        onUseHereClick={vi.fn()}
      />
    );
    expect(container.firstChild).toHaveClass("my-notice");
  });

  it("exposes region semantics and title id for accessibility", () => {
    render(<SingleTabEnforcement onUseHereClick={vi.fn()} />);
    const region = screen.getByRole("region");
    const heading = screen.getByRole("heading", {
      name: "Session active in another tab",
    });
    expect(region).toHaveAttribute(
      "aria-labelledby",
      heading.getAttribute("id")
    );
  });

  it("keeps paragraph margins reset for Bootstrap hosts", () => {
    const { container } = render(<SingleTabEnforcement onUseHereClick={vi.fn()} />);
    assertNoBootstrapMarginBleed(container);
  });
});
