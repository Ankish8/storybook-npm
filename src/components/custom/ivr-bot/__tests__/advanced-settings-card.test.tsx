import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  AdvancedSettingsCard,
  defaultMaximumSilenceRetriesHelpText,
} from "../advanced-settings-card";

function expandAdvanced() {
  fireEvent.click(screen.getByRole("button", { name: /advanced settings/i }));
}

describe("AdvancedSettingsCard", () => {
  it("renders Advanced Settings accordion trigger", () => {
    render(<AdvancedSettingsCard data={{}} onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: /advanced settings/i })
    ).toBeInTheDocument();
  });

  it("shows muted helper text under Maximum Silence Retries when expanded", () => {
    render(<AdvancedSettingsCard data={{}} onChange={() => {}} />);
    expandAdvanced();
    expect(
      screen.getByText(defaultMaximumSilenceRetriesHelpText)
    ).toBeInTheDocument();
  });

  it("forwards ref to the root element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<AdvancedSettingsCard ref={ref} data={{}} onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className to the root", () => {
    const { container } = render(
      <AdvancedSettingsCard
        className="my-advanced-card"
        data={{}}
        onChange={() => {}}
      />
    );
    expect(container.firstChild).toHaveClass("my-advanced-card");
  });

  it("does not call onChange while typing; commits valid value on blur", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 15 }}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const input = document.getElementById(
      "advanced-silence-timeout"
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    onChange.mockClear();
    fireEvent.change(input, { target: { value: "1" } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "12" } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith({ silenceTimeout: 12 });
  });

  it("keeps input empty when cleared and shows required error on blur", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 15 }}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const input = document.getElementById(
      "advanced-silence-timeout"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("");
    expect(onChange).toHaveBeenCalledWith({ silenceTimeout: undefined });
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("shows range error on blur when value is below min", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 10 }}
        silenceTimeoutMin={1}
        silenceTimeoutMax={60}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const input = document.getElementById(
      "advanced-silence-timeout"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.blur(input);
    expect(
      screen.getByText("Value must be between 1 and 60")
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows range error on blur when value is above max", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 10 }}
        silenceTimeoutMin={1}
        silenceTimeoutMax={60}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const input = document.getElementById(
      "advanced-silence-timeout"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "61" } });
    fireEvent.blur(input);
    expect(
      screen.getByText("Value must be between 1 and 60")
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not show required error when field is optional and left empty", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 5 }}
        silenceTimeoutRequired={false}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const input = document.getElementById(
      "advanced-silence-timeout"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith({ silenceTimeout: undefined });
    expect(screen.queryByText("This field is required")).not.toBeInTheDocument();
  });

  it("increments from empty to min and disables decrement when empty", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: undefined }}
        onChange={onChange}
        silenceTimeoutMin={3}
        silenceTimeoutMax={60}
      />
    );
    expandAdvanced();
    const up = screen.getAllByRole("button", { name: "Increase" })[0];
    const down = screen.getAllByRole("button", { name: "Decrease" })[0];
    expect(down).toBeDisabled();
    fireEvent.click(up);
    expect(onChange).toHaveBeenCalledWith({ silenceTimeout: 3 });
  });

  it("does not increment above max", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ callEndThreshold: 10 }}
        callEndThresholdMin={1}
        callEndThresholdMax={10}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const up = screen.getAllByRole("button", { name: "Increase" })[1];
    expect(up).toBeDisabled();
  });

  it("does not decrement below min", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ callEndThreshold: 1 }}
        callEndThresholdMin={1}
        callEndThresholdMax={10}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const down = screen.getAllByRole("button", { name: "Decrease" })[1];
    expect(down).toBeDisabled();
  });

  it("clamps out-of-range prop values into range via effect", async () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 200 }}
        silenceTimeoutMin={1}
        silenceTimeoutMax={60}
        onChange={onChange}
      />
    );
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ silenceTimeout: 60 });
    });
  });

  it("applies numericBounds shorthand and allows per-field overrides", () => {
    const onChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 10, callEndThreshold: 2 }}
        numericBounds={{
          silenceTimeoutMin: 5,
          silenceTimeoutMax: 20,
          callEndThresholdMin: 1,
          callEndThresholdMax: 10,
        }}
        silenceTimeoutMax={12}
        onChange={onChange}
      />
    );
    expandAdvanced();
    const silenceInput = document.getElementById(
      "advanced-silence-timeout"
    ) as HTMLInputElement;
    fireEvent.change(silenceInput, { target: { value: "4" } });
    fireEvent.blur(silenceInput);
    expect(
      screen.getByText("Value must be between 5 and 12")
    ).toBeInTheDocument();
  });

  it("calls onAdvancedSettingsChange with patch alongside onChange", () => {
    const onChange = vi.fn();
    const onAdvancedSettingsChange = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ interruptionHandling: true }}
        onChange={onChange}
        onAdvancedSettingsChange={onAdvancedSettingsChange}
      />
    );
    expandAdvanced();
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith({ interruptionHandling: false });
    expect(onAdvancedSettingsChange).toHaveBeenCalledWith({
      interruptionHandling: false,
    });
  });

  it("calls onSilenceTimeoutBlur with valid detail after successful blur", () => {
    const onSilenceTimeoutBlur = vi.fn();
    render(
      <AdvancedSettingsCard
        data={{ silenceTimeout: 10 }}
        onChange={() => {}}
        silenceTimeoutMin={1}
        silenceTimeoutMax={60}
        onSilenceTimeoutBlur={onSilenceTimeoutBlur}
      />
    );
    expandAdvanced();
    const input = document.getElementById(
      "advanced-silence-timeout"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "11" } });
    fireEvent.blur(input);
    expect(onSilenceTimeoutBlur).toHaveBeenCalledWith({
      value: 11,
      valid: true,
    });
  });
});
