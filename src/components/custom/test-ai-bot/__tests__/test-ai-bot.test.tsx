import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestAIBot } from "../test-ai-bot";

const qrSrc =
  "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";

describe("TestAIBot", () => {
  it("renders title, description, QR image, and primary button", () => {
    render(
      <TestAIBot
        open
        title="Test your AI bot"
        description="Scan the QR code to start testing."
        qrSrc={qrSrc}
        buttonLabel="Test on WhatsApp web"
      />
    );

    expect(screen.getByText("Test your AI bot")).toBeInTheDocument();
    expect(
      screen.getByText("Scan the QR code to start testing.")
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "QR code" })).toHaveAttribute(
      "src",
      qrSrc
    );
    expect(
      screen.getByRole("button", { name: "Test on WhatsApp web" })
    ).toBeInTheDocument();
  });

  it("calls button onClick from buttonProps", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <TestAIBot
        open
        title="Title"
        qrSrc={qrSrc}
        buttonLabel="Go"
        buttonProps={{ onClick }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when dialog closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <TestAIBot
        open
        title="Title"
        qrSrc={qrSrc}
        buttonLabel="Go"
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
