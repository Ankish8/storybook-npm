import "@testing-library/jest-dom/vitest";
import React from "react";
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
  function StatefulFrustrationHandoverCard(
    props: Partial<React.ComponentProps<typeof FrustrationHandoverCard>> = {}
  ) {
    const [data, setData] = React.useState({
      frustrationHandoverEnabled: true,
      escalationPrompt: "",
      escalationDepartment: "",
      ...props.data,
    });

    return (
      <FrustrationHandoverCard
        {...props}
        data={data}
        onChange={(patch) => {
          setData((prev) => ({ ...prev, ...patch }));
          props.onChange?.(patch);
        }}
      />
    );
  }

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

  it("does not allow Prompt input beyond promptMaxLength", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const max = 10;

    render(
      <FrustrationHandoverCard
        data={{
          frustrationHandoverEnabled: true,
          escalationPrompt: "1234567890",
          escalationDepartment: "",
        }}
        onChange={onChange}
        promptMaxLength={max}
      />
    );

    await user.click(screen.getByText("Escalate to Human"));
    const prompt = screen.getByRole("textbox", { name: /^prompt$/i });
    expect(prompt).toHaveValue("1234567890");
    expect(prompt).toHaveAttribute("maxLength", String(max));

    await user.type(prompt, "x");
    expect(onChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ escalationPrompt: "1234567890x" })
    );
    expect(prompt).toHaveValue("1234567890");
  });

  it("uses fixed-size Prompt textarea like other prompt fields", async () => {
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
    const prompt = screen.getByRole("textbox", { name: /^prompt$/i });
    expect(prompt).toHaveClass("resize-none");
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

  it("does not show built-in Prompt validation on first view", async () => {
    const user = userEvent.setup();
    render(<StatefulFrustrationHandoverCard />);

    await user.click(screen.getByText("Escalate to Human"));
    expect(
      screen.queryByText("Escalation prompt is required")
    ).not.toBeInTheDocument();
  });

  it("validates Prompt after interaction and clears in real time while typing", async () => {
    const user = userEvent.setup();
    render(<StatefulFrustrationHandoverCard />);

    await user.click(screen.getByText("Escalate to Human"));
    const prompt = screen.getByRole("textbox", { name: /^prompt$/i });
    await user.click(prompt);
    await user.tab();

    expect(screen.getByText("Escalation prompt is required")).toBeInTheDocument();

    await user.click(prompt);
    await user.type(prompt, "Connect caller to support");

    expect(
      screen.queryByText("Escalation prompt is required")
    ).not.toBeInTheDocument();
  });

  it("lets external Prompt validation override the built-in message", async () => {
    const user = userEvent.setup();
    render(
      <StatefulFrustrationHandoverCard promptValidation="Prompt is invalid" />
    );

    await user.click(screen.getByText("Escalate to Human"));
    expect(screen.getByText("Prompt is invalid")).toBeInTheDocument();
    expect(
      screen.queryByText("Escalation prompt is required")
    ).not.toBeInTheDocument();
  });

  it("can disable built-in Prompt validation", async () => {
    const user = userEvent.setup();
    render(
      <StatefulFrustrationHandoverCard promptErrorMessageValidation={false} />
    );

    await user.click(screen.getByText("Escalate to Human"));
    const prompt = screen.getByRole("textbox", { name: /^prompt$/i });
    await user.click(prompt);
    await user.tab();

    expect(
      screen.queryByText("Escalation prompt is required")
    ).not.toBeInTheDocument();
  });

  it("does not show built-in Transfer to Department validation on first view", async () => {
    const user = userEvent.setup();
    render(<StatefulFrustrationHandoverCard />);

    await user.click(screen.getByText("Escalate to Human"));
    expect(
      screen.queryByText("Escalation department is required")
    ).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "false"
    );
  });

  it("does not show built-in Transfer to Department validation without message prop", async () => {
    const user = userEvent.setup();
    render(<StatefulFrustrationHandoverCard escalationDepartmentValidation />);

    await user.click(screen.getByText("Escalate to Human"));
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");

    expect(
      screen.queryByText("Escalation department is required")
    ).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "false"
    );
  });

  it("shows Transfer to Department validation on render when message prop is provided", async () => {
    const user = userEvent.setup();
    render(
      <StatefulFrustrationHandoverCard
        escalationDepartmentValidationMessage="Escalation department is required"
      />
    );

    await user.click(screen.getByText("Escalate to Human"));

    expect(
      screen.getByText("Escalation department is required")
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Support" }));

    expect(
      screen.queryByText("Escalation department is required")
    ).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "false"
    );
  });

  it("uses custom Transfer to Department validation message on render", async () => {
    const user = userEvent.setup();
    render(
      <StatefulFrustrationHandoverCard
        escalationDepartmentValidationMessage="Choose a routing department"
      />
    );

    await user.click(screen.getByText("Escalate to Human"));

    expect(screen.getByText("Choose a routing department")).toBeInTheDocument();
  });

  it("does not show Transfer to Department validation when validation prop is false", async () => {
    const user = userEvent.setup();
    render(
      <StatefulFrustrationHandoverCard
        escalationDepartmentValidation={false}
        escalationDepartmentValidationMessage="Department is unavailable"
      />
    );

    await user.click(screen.getByText("Escalate to Human"));
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");

    expect(
      screen.queryByText("Department is unavailable")
    ).not.toBeInTheDocument();
  });

  it("can disable built-in Transfer to Department validation", async () => {
    const user = userEvent.setup();
    render(
      <StatefulFrustrationHandoverCard
        escalationDepartmentValidation={false}
        escalationDepartmentValidationMessage="Escalation department is required"
      />
    );

    await user.click(screen.getByText("Escalate to Human"));
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");

    expect(
      screen.queryByText("Escalation department is required")
    ).not.toBeInTheDocument();
  });

});
