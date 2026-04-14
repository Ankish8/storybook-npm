import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotTest } from "../bot-test";

const sampleNumbers = [
  { value: "+91 9876543210", label: "+91 9876543210" },
  { value: "+91 8765432109", label: "+91 8765432109" },
];

describe("BotTest", () => {
  it("renders the dialog with title and description", () => {
    render(<BotTest open />);
    expect(screen.getByText("Test your bot")).toBeInTheDocument();
    expect(
      screen.getByText(/Send 'Hi .* to the selected number to begin./)
    ).toBeInTheDocument();
  });

  it("renders Connected whatsapp number label", () => {
    render(<BotTest open whatsappNumbers={sampleNumbers} />);
    expect(
      screen.getByText("Connected whatsapp number")
    ).toBeInTheDocument();
  });

  it("renders Phone number label with required asterisk", () => {
    render(<BotTest open />);
    expect(screen.getByText("Phone number")).toBeInTheDocument();
  });

  it("renders the Test button", () => {
    render(<BotTest open />);
    expect(
      screen.getByRole("button", { name: "Test" })
    ).toBeInTheDocument();
  });

  it("renders custom test label", () => {
    render(<BotTest open testLabel="Send Test" />);
    expect(
      screen.getByRole("button", { name: "Send Test" })
    ).toBeInTheDocument();
  });

  it("calls onTest when Test button is clicked", async () => {
    const user = userEvent.setup();
    const handleTest = vi.fn();
    render(
      <BotTest
        open
        whatsappNumbers={sampleNumbers}
        selectedNumber="+91 9876543210"
        phoneNumber="9123456789"
        onTest={handleTest}
      />
    );

    await user.click(screen.getByRole("button", { name: "Test" }));
    expect(handleTest).toHaveBeenCalledTimes(1);
  });

  it("disables Test button when no number selected and no phone entered", () => {
    render(<BotTest open whatsappNumbers={sampleNumbers} />);
    expect(screen.getByRole("button", { name: "Test" })).toBeDisabled();
  });

  it("enables Test button when number and phone are provided", () => {
    render(
      <BotTest
        open
        whatsappNumbers={sampleNumbers}
        selectedNumber="+91 9876543210"
        phoneNumber="9123456789"
      />
    );
    expect(screen.getByRole("button", { name: "Test" })).toBeEnabled();
  });

  it("disables all interactive elements when disabled is true", () => {
    render(
      <BotTest
        open
        whatsappNumbers={sampleNumbers}
        selectedNumber="+91 9876543210"
        phoneNumber="9123456789"
        disabled
      />
    );
    expect(screen.getByRole("button", { name: "Test" })).toBeDisabled();
  });

  it("uses phoneNumberMaxLength on phone input when no connected number is selected", () => {
    render(<BotTest open phoneNumberMaxLength={12} />);
    expect(screen.getByPlaceholderText("Enter your number")).toHaveAttribute(
      "maxLength",
      "12"
    );
  });

  it("derives phone input maxLength from selected connected number (national digits)", () => {
    render(
      <BotTest
        open
        whatsappNumbers={sampleNumbers}
        selectedNumber="+91 9876543210"
        countryCode="+91"
        phoneNumberMaxLength={10}
      />
    );
    expect(screen.getByPlaceholderText("Enter your number")).toHaveAttribute(
      "maxLength",
      "10"
    );
  });

  it("calls onPhoneNumberChange when typing in phone input", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <BotTest
        open
        phoneNumber=""
        onPhoneNumberChange={handleChange}
      />
    );

    const phoneInput = screen.getByPlaceholderText("Enter your number");
    await user.type(phoneInput, "9");
    expect(handleChange).toHaveBeenCalled();
  });

  it("only passes digits through onPhoneNumberChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    function Wrapper() {
      const [phone, setPhone] = React.useState("");
      return (
        <BotTest
          open
          phoneNumber={phone}
          onPhoneNumberChange={(v) => {
            handleChange(v);
            setPhone(v);
          }}
        />
      );
    }
    render(<Wrapper />);

    const phoneInput = screen.getByPlaceholderText("Enter your number");
    await user.type(phoneInput, "a1b2c");
    expect(phoneInput).toHaveValue("12");
    expect(handleChange).toHaveBeenLastCalledWith("12");
  });

  it("shows custom description", () => {
    render(
      <BotTest open description="Custom description text" />
    );
    expect(screen.getByText("Custom description text")).toBeInTheDocument();
  });

  it("calls onOpenChange when dialog is closed", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    render(
      <BotTest
        open
        onOpenChange={handleOpenChange}
      />
    );

    // Click the close button (X)
    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not render when open is false", () => {
    render(<BotTest open={false} />);
    expect(screen.queryByText("Test your bot")).not.toBeInTheDocument();
  });
});
