import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SelectedVariablesPopover } from "../selected-variables-popover";
import { parseValueToSegments } from "../types";

const segments = parseValueToSegments("{{Order_id}} and {{customer_name}}");

describe("SelectedVariablesPopover", () => {
  it("renders nothing when open is false", () => {
    const anchorRef = { current: document.createElement("button") };
    render(
      <SelectedVariablesPopover
        open={false}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        segments={segments}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog with variable list when open (no header when title omitted)", () => {
    const anchorRef = { current: document.createElement("button") };
    render(
      <SelectedVariablesPopover
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        segments={segments}
      />
    );
    expect(
      screen.getByRole("dialog", { name: /all variables/i })
    ).toBeInTheDocument();
    expect(screen.queryByText("Variables")).not.toBeInTheDocument();
    expect(screen.getByText("{{Order_id}}")).toBeInTheDocument();
    expect(screen.getByText("{{customer_name}}")).toBeInTheDocument();
  });

  it("renders title and divider when title prop is set", () => {
    const anchorRef = { current: document.createElement("button") };
    render(
      <SelectedVariablesPopover
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        segments={segments}
        title="Variables"
      />
    );
    expect(screen.getByRole("dialog", { name: /variables/i })).toBeInTheDocument();
    expect(screen.getByText("Variables")).toBeInTheDocument();
  });

  it("renders empty state when no segments", () => {
    const anchorRef = { current: document.createElement("button") };
    render(
      <SelectedVariablesPopover
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        segments={[]}
      />
    );
    expect(screen.getByText(/no content/i)).toBeInTheDocument();
  });
});
