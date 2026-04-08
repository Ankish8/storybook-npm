import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotSettings } from "../bot-settings";

describe("BotSettings", () => {
  it("renders Settings title", () => {
    render(<BotSettings />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("shows content by default and hides on toggle", async () => {
    const user = userEvent.setup();
    render(<BotSettings phoneNumbers={["+91 9876543210"]} />);

    // Content visible by default
    expect(screen.getByText("Connect WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("+91 9876543210")).toBeInTheDocument();

    // Click header to collapse
    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.queryByText("Connect WhatsApp")).not.toBeInTheDocument();

    // Click header again to expand
    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.getByText("Connect WhatsApp")).toBeInTheDocument();
  });

  it("renders phone number chips", () => {
    const phones = ["+91 1111111111", "+91 2222222222", "+91 3333333333"];
    render(<BotSettings phoneNumbers={phones} />);
    phones.forEach((phone) => {
      expect(screen.getByText(phone)).toBeInTheDocument();
    });
  });

  it("calls onRemovePhoneNumber when X clicked on a chip", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(
      <BotSettings
        phoneNumbers={["+91 9876543210"]}
        onRemovePhoneNumber={handleRemove}
      />
    );

    await user.click(screen.getByLabelText("Remove +91 9876543210"));
    expect(handleRemove).toHaveBeenCalledWith("+91 9876543210");
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenDropdown when dropdown chevron clicked", async () => {
    const user = userEvent.setup();
    const handleDropdown = vi.fn();
    render(<BotSettings onOpenDropdown={handleDropdown} />);

    await user.click(
      screen.getByLabelText("Open phone number dropdown")
    );
    expect(handleDropdown).toHaveBeenCalledTimes(1);
  });

  it("merges custom className", () => {
    const { container } = render(
      <BotSettings className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BotSettings ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props on root element", () => {
    render(<BotSettings data-testid="bot-settings-root" />);
    expect(screen.getByTestId("bot-settings-root")).toBeInTheDocument();
  });

  it("starts collapsed when defaultOpen is false", () => {
    render(
      <BotSettings
        defaultOpen={false}
        phoneNumbers={["+91 9876543210"]}
      />
    );
    expect(screen.queryByText("Connect WhatsApp")).not.toBeInTheDocument();
    expect(screen.queryByText("+91 9876543210")).not.toBeInTheDocument();
  });

  it("renders empty tag input when no phone numbers provided", () => {
    render(<BotSettings />);
    // Connect WhatsApp section is visible but no chips
    expect(screen.getByText("Connect WhatsApp")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Open phone number dropdown")
    ).toBeInTheDocument();
  });
});
