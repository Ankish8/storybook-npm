import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FrustrationHandoverCard,
  type DepartmentOption,
} from "../frustration-handover-card";

function makeDepartments(count: number): DepartmentOption[] {
  return Array.from({ length: count }, (_, i) => ({
    value: `dept-${i + 1}`,
    label: `Department ${i + 1}`,
  }));
}

describe("FrustrationHandoverCard", () => {
  it("renders Transfer to department when escalation is enabled", async () => {
    const user = userEvent.setup();
    render(
      <FrustrationHandoverCard
        data={{
          frustrationHandoverEnabled: true,
          escalationPrompt: "",
          escalationDepartment: "",
        }}
        onChange={() => {}}
      />
    );

    await user.click(screen.getByText("Escalate to Human"));
    await user.click(screen.getByRole("combobox"));
    expect(
      screen.getByRole("option", { name: "Support" })
    ).toBeInTheDocument();
  });

  it("calls onDepartmentOptionsScrollEnd when viewport scroll ends near the bottom", async () => {
    const onDepartmentOptionsScrollEnd = vi.fn();
    const user = userEvent.setup();

    render(
      <FrustrationHandoverCard
        data={{
          frustrationHandoverEnabled: true,
          escalationPrompt: "",
          escalationDepartment: "",
        }}
        onChange={() => {}}
        departmentOptions={makeDepartments(12)}
        onDepartmentOptionsScrollEnd={onDepartmentOptionsScrollEnd}
      />
    );

    await user.click(screen.getByText("Escalate to Human"));
    await user.click(screen.getByRole("combobox"));
    const viewport = document.querySelector("[data-select-viewport]");
    expect(viewport).toBeTruthy();
    Object.defineProperty(viewport, "scrollHeight", {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(viewport, "clientHeight", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(viewport, "scrollTop", {
      configurable: true,
      value: 300,
    });
    viewport!.dispatchEvent(new Event("scrollend", { bubbles: true }));
    expect(onDepartmentOptionsScrollEnd).toHaveBeenCalledTimes(1);
  });

  it("does not call onDepartmentOptionsScrollEnd when departmentOptionsHasMore is false", async () => {
    const onDepartmentOptionsScrollEnd = vi.fn();
    const user = userEvent.setup();

    render(
      <FrustrationHandoverCard
        data={{
          frustrationHandoverEnabled: true,
          escalationPrompt: "",
          escalationDepartment: "",
        }}
        onChange={() => {}}
        departmentOptions={makeDepartments(5)}
        onDepartmentOptionsScrollEnd={onDepartmentOptionsScrollEnd}
        departmentOptionsHasMore={false}
      />
    );

    await user.click(screen.getByText("Escalate to Human"));
    await user.click(screen.getByRole("combobox"));
    const viewport = document.querySelector("[data-select-viewport]");
    Object.defineProperty(viewport, "scrollHeight", {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(viewport, "clientHeight", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(viewport, "scrollTop", {
      configurable: true,
      value: 300,
    });
    viewport!.dispatchEvent(new Event("scrollend", { bubbles: true }));
    expect(onDepartmentOptionsScrollEnd).not.toHaveBeenCalled();
  });

  it("does not call onDepartmentOptionsScrollEnd while departmentOptionsLoadingMore is true", async () => {
    const onDepartmentOptionsScrollEnd = vi.fn();
    const user = userEvent.setup();

    render(
      <FrustrationHandoverCard
        data={{
          frustrationHandoverEnabled: true,
          escalationPrompt: "",
          escalationDepartment: "",
        }}
        onChange={() => {}}
        departmentOptions={makeDepartments(12)}
        onDepartmentOptionsScrollEnd={onDepartmentOptionsScrollEnd}
        departmentOptionsLoadingMore
      />
    );

    await user.click(screen.getByText("Escalate to Human"));
    await user.click(screen.getByRole("combobox"));
    const viewport = document.querySelector("[data-select-viewport]");
    Object.defineProperty(viewport, "scrollHeight", {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(viewport, "clientHeight", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(viewport, "scrollTop", {
      configurable: true,
      value: 300,
    });
    viewport!.dispatchEvent(new Event("scrollend", { bubbles: true }));
    expect(onDepartmentOptionsScrollEnd).not.toHaveBeenCalled();
  });

  it("does not render Prompt when showEscalationPrompt is false", async () => {
    const user = userEvent.setup();
    render(
      <FrustrationHandoverCard
        data={{
          frustrationHandoverEnabled: true,
          escalationPrompt: "x",
          escalationDepartment: "",
        }}
        onChange={() => {}}
        showEscalationPrompt={false}
      />
    );
    await user.click(screen.getByText("Escalate to Human"));
    expect(
      screen.queryByRole("textbox", { name: /^prompt$/i })
    ).not.toBeInTheDocument();
  });
});
