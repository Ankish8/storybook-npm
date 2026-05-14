import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ChatMessage } from "../../chat-types";
import { TooltipProvider } from "../../../ui/tooltip";
import { ChatBubble } from "..";

function renderWithTooltip(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe("ChatBubble", () => {
  it("renders children text in sender variant", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Hello from agent
      </ChatBubble>
    );
    expect(screen.getByText("Hello from agent")).toBeInTheDocument();
  });

  it("renders children text in receiver variant", () => {
    render(
      <ChatBubble variant="receiver" timestamp="2:16 PM">
        Hello from customer
      </ChatBubble>
    );
    expect(screen.getByText("Hello from customer")).toBeInTheDocument();
  });

  it("sender variant has info surface background class", () => {
    const { container } = render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Test
      </ChatBubble>
    );
    const bubble = container.querySelector(".bg-semantic-info-surface");
    expect(bubble).toBeInTheDocument();
  });

  it("receiver variant has white background", () => {
    const { container } = render(
      <ChatBubble variant="receiver" timestamp="2:16 PM">
        Test
      </ChatBubble>
    );
    const bubble = container.querySelector(".bg-white");
    expect(bubble).toBeInTheDocument();
  });

  it("shows sender name when provided (receiver variant; agent identity comes from sentBy tooltip)", () => {
    render(
      <ChatBubble variant="receiver" timestamp="2:15 PM" senderName="Alex Smith">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Alex Smith")).toBeInTheDocument();
  });

  it("does not render senderName text on sender variant (icon tooltip carries identity)", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" senderName="Alex Smith">
        Test
      </ChatBubble>
    );
    expect(screen.queryByText("Alex Smith")).not.toBeInTheDocument();
  });

  it("shows delivery status for sender variant", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="sent">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Sent")).toBeInTheDocument();
  });

  it("hides delivery status for receiver variant", () => {
    render(
      <ChatBubble variant="receiver" timestamp="2:16 PM" status="sent">
        Test
      </ChatBubble>
    );
    expect(screen.queryByText("Sent")).not.toBeInTheDocument();
  });

  it("shows timestamp", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("2:15 PM")).toBeInTheDocument();
  });

  it("renders reply quote when reply prop is provided", () => {
    render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        reply={{ sender: "John", message: "Original message" }}
      >
        Reply text
      </ChatBubble>
    );
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Original message")).toBeInTheDocument();
  });

  it("renders media slot content", () => {
    render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        media={<div data-testid="media-content">Media here</div>}
      >
        Caption text
      </ChatBubble>
    );
    expect(screen.getByTestId("media-content")).toBeInTheDocument();
    expect(screen.getByText("Caption text")).toBeInTheDocument();
  });

  it("custom className is applied", () => {
    const { container } = render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        className="custom-class"
      >
        Test
      </ChatBubble>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("custom-class");
  });

  it("ref forwarding works", () => {
    const ref = vi.fn();
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" ref={ref}>
        Test
      </ChatBubble>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("data-testid spreads correctly", () => {
    render(
      <ChatBubble
        variant="sender"
        timestamp="2:15 PM"
        data-testid="chat-bubble"
      >
        Test
      </ChatBubble>
    );
    expect(screen.getByTestId("chat-bubble")).toBeInTheDocument();
  });

  it("failed status shows error styling", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="failed">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Failed to send")).toBeInTheDocument();
    const failedText = screen.getByText("Failed to send");
    expect(failedText).toHaveClass("text-semantic-error-primary");
  });

  it("shows delivered status with correct text", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="delivered">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("shows read status with correct text", () => {
    render(
      <ChatBubble variant="sender" timestamp="2:15 PM" status="read">
        Test
      </ChatBubble>
    );
    expect(screen.getByText("Read")).toBeInTheDocument();
  });

  it("sender variant aligns to the right", () => {
    const { container } = render(
      <ChatBubble variant="sender" timestamp="2:15 PM">
        Test
      </ChatBubble>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("justify-end");
  });

  it("receiver variant aligns to the left", () => {
    const { container } = render(
      <ChatBubble variant="receiver" timestamp="2:16 PM">
        Test
      </ChatBubble>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("justify-start");
  });

  describe("manual mode reply (onReplyTo + showReplyOn)", () => {
    it("does not render Reply when onReplyTo is omitted", () => {
      renderWithTooltip(
        <ChatBubble variant="receiver" timestamp="2:16 PM">
          Hey
        </ChatBubble>
      );
      expect(
        screen.queryByRole("button", { name: "Reply" })
      ).not.toBeInTheDocument();
    });

    it("receiver short text bubble: minWidth 7rem + left-aligned footer (per Figma)", () => {
      const { container } = render(
        <ChatBubble variant="receiver" timestamp="03:43 am">
          Bhjg
        </ChatBubble>
      );
      const blockFooter = container.querySelector("div.mt-1\\.5");
      expect(blockFooter).toHaveClass("justify-start");
      const bubble = container.querySelector("div.rounded.overflow-hidden");
      expect((bubble as HTMLElement).style.minWidth).toBe("7rem");
    });

    it("sender text-only with no status: minWidth 7rem", () => {
      const { container } = render(
        <ChatBubble variant="sender" timestamp="03:43 am">
          Hi
        </ChatBubble>
      );
      const bubble = container.querySelector("div.rounded.overflow-hidden");
      expect((bubble as HTMLElement).style.minWidth).toBe("7rem");
    });

    it("sender text-only with 'read' status: minWidth 9.5rem", () => {
      const { container } = render(
        <ChatBubble variant="sender" timestamp="03:43 am" status="read">
          Hi
        </ChatBubble>
      );
      const bubble = container.querySelector("div.rounded.overflow-hidden");
      expect((bubble as HTMLElement).style.minWidth).toBe("9.5rem");
    });

    it("sender text-only with 'failed' status: minWidth 12rem (room for Retry button)", () => {
      const { container } = render(
        <ChatBubble variant="sender" timestamp="03:43 am" status="failed">
          Hi
        </ChatBubble>
      );
      const bubble = container.querySelector("div.rounded.overflow-hidden");
      expect((bubble as HTMLElement).style.minWidth).toBe("12rem");
    });

    it("textMaxWidthClassName defaults to max-w-[65%] on the column (manual mode)", () => {
      const { container } = render(
        <ChatBubble variant="sender" timestamp="2:15 PM">
          Hi
        </ChatBubble>
      );
      const column = container.querySelector("div.flex.flex-col");
      expect(column).toHaveClass("max-w-[65%]");
    });

    it("textMaxWidthClassName override is applied on the column (manual mode)", () => {
      const { container } = render(
        <ChatBubble
          variant="sender"
          timestamp="2:15 PM"
          textMaxWidthClassName="max-w-[52%]"
        >
          Hi
        </ChatBubble>
      );
      const column = container.querySelector("div.flex.flex-col");
      expect(column).toHaveClass("max-w-[52%]");
      expect(column).not.toHaveClass("max-w-[65%]");
    });

    it("textMaxWidthClassName override flows through message mode too", () => {
      const msg: ChatMessage = {
        id: "m-x",
        text: "Hi",
        time: "2:15 PM",
        sender: "agent",
        type: "text",
      };
      const { container } = render(
        <ChatBubble message={msg} textMaxWidthClassName="max-w-[480px]" />
      );
      const column = container.querySelector("div.flex.flex-col");
      expect(column).toHaveClass("max-w-[480px]");
    });

    it("textMaxWidthClassName is ignored for media variants (manual mode)", () => {
      const { container } = render(
        <ChatBubble
          variant="sender"
          timestamp="2:15 PM"
          maxWidth="media"
          media={<div data-testid="m" />}
          textMaxWidthClassName="max-w-[52%]"
        />
      );
      const column = container.querySelector("div.flex.flex-col");
      // media variant keeps its absolute-px cap, not the prop's percentage.
      expect(column).toHaveClass("max-w-[380px]");
      expect(column).not.toHaveClass("max-w-[52%]");
    });

    it("media bubble: no inline minWidth applied (bubble already w-full)", () => {
      const { container } = render(
        <ChatBubble
          variant="sender"
          timestamp="03:43 am"
          media={<div data-testid="media" />}
        />
      );
      const bubble = container.querySelector("div.rounded.overflow-hidden");
      expect((bubble as HTMLElement).style.minWidth).toBe("");
    });

    it("reserves column padding when senderIndicator is present so the avatar stays inside the box", () => {
      // Without this padding, the absolutely-positioned senderIndicator overflows
      // the column's right edge and gets clipped by any ancestor with overflow:hidden.
      const { container } = render(
        <ChatBubble
          variant="sender"
          timestamp="2:15 PM"
          senderIndicator={<span data-testid="avatar">A</span>}
        >
          Short
        </ChatBubble>
      );
      // The column is the second-level wrapper; it should carry pr-9 in this case.
      const column = container.querySelector("div.flex.flex-col");
      expect(column).not.toBeNull();
      expect(column).toHaveClass("pr-9");
    });

    it("does NOT reserve avatar padding when senderIndicator is absent", () => {
      const { container } = render(
        <ChatBubble variant="sender" timestamp="2:15 PM">
          Short
        </ChatBubble>
      );
      const column = container.querySelector("div.flex.flex-col");
      expect(column).not.toBeNull();
      expect(column).not.toHaveClass("pr-9");
    });

    it("sender bubble keeps block footer (status icons + right-aligned)", () => {
      const { container } = render(
        <ChatBubble variant="sender" timestamp="03:43 am" status="read">
          Outgoing
        </ChatBubble>
      );
      // Block footer present.
      const blockFooter = container.querySelector("div.mt-1\\.5");
      expect(blockFooter).not.toBeNull();
      // Status label + timestamp present; both have whitespace-nowrap so neither breaks.
      expect(blockFooter?.textContent).toContain("Read");
      expect(blockFooter?.textContent).toContain("03:43 am");
      // Footer is right-aligned for sender.
      expect(blockFooter).toHaveClass("justify-end");
    });

    it("renders without a wrapping TooltipProvider (manual mode is self-contained)", () => {
      // Plain `render` — NO TooltipProvider in the tree. Catches the regression
      // where manual-mode reply button required an outer provider and threw at runtime.
      expect(() =>
        render(
          <ChatBubble
            variant="receiver"
            timestamp="2:16 PM"
            messageId="m"
            replyParticipantName="Aditi"
            onReplyTo={vi.fn()}
            showReplyOn="both"
          >
            Hello
          </ChatBubble>
        )
      ).not.toThrow();
      expect(screen.getByRole("button", { name: "Reply" })).toBeInTheDocument();
    });

    it("shows Reply on receiver by default and forwards payload", () => {
      const onReplyTo = vi.fn();
      renderWithTooltip(
        <ChatBubble
          variant="receiver"
          timestamp="2:16 PM"
          messageId="manual-1"
          senderName="Aditi"
          replyParticipantName="Aditi"
          onReplyTo={onReplyTo}
        >
          Hey there
        </ChatBubble>
      );
      fireEvent.click(screen.getByRole("button", { name: "Reply" }));
      expect(onReplyTo).toHaveBeenCalledWith({
        messageId: "manual-1",
        sender: "Aditi",
        text: "Hey there",
      });
    });

    it("hides Reply on sender variant by default", () => {
      renderWithTooltip(
        <ChatBubble
          variant="sender"
          timestamp="2:16 PM"
          onReplyTo={vi.fn()}
        >
          Outgoing
        </ChatBubble>
      );
      expect(
        screen.queryByRole("button", { name: "Reply" })
      ).not.toBeInTheDocument();
    });

    it("shows Reply on sender when showReplyOn='agent' or 'both'", () => {
      const onReplyTo = vi.fn();
      renderWithTooltip(
        <ChatBubble
          variant="sender"
          timestamp="2:16 PM"
          messageId="manual-2"
          senderName="Alex"
          onReplyTo={onReplyTo}
          showReplyOn="agent"
        >
          Outgoing line
        </ChatBubble>
      );
      fireEvent.click(screen.getByRole("button", { name: "Reply" }));
      expect(onReplyTo).toHaveBeenCalledWith({
        messageId: "manual-2",
        sender: "Alex",
        text: "Outgoing line",
      });
    });
  });

  describe("message mode (ChatMessage)", () => {
    const baseMsg: ChatMessage = {
      id: "m1",
      text: "Hello from template",
      time: "3:00 PM",
      sender: "customer",
      type: "text",
    };

    it("renders text from message payload", () => {
      render(<ChatBubble message={baseMsg} />);
      expect(screen.getByText("Hello from template")).toBeInTheDocument();
      expect(screen.getByText("3:00 PM")).toBeInTheDocument();
    });

    it("anchors dom id for scroll-to-quote", () => {
      const { container } = render(<ChatBubble message={baseMsg} />);
      expect(container.querySelector("#msg-m1")).toBeInTheDocument();
    });

    it("invokes onReplyTo for customer messages", () => {
      const onReplyTo = vi.fn();
      renderWithTooltip(
        <ChatBubble
          message={baseMsg}
          replyParticipantName="Jane"
          onReplyTo={onReplyTo}
        />
      );
      const replyBtn = screen.getByRole("button", { name: "Reply" });
      fireEvent.click(replyBtn);
      expect(onReplyTo).toHaveBeenCalledWith({
        messageId: "m1",
        sender: "Jane",
        text: "Hello from template",
      });
    });

    it("hides Reply on agent messages by default (showReplyOn defaults to customer)", () => {
      const agentMsg: ChatMessage = {
        id: "m-agent",
        text: "Agent message",
        time: "3:00 PM",
        sender: "agent",
        type: "text",
        status: "read",
      };
      renderWithTooltip(
        <ChatBubble message={agentMsg} onReplyTo={vi.fn()} />
      );
      expect(
        screen.queryByRole("button", { name: "Reply" })
      ).not.toBeInTheDocument();
    });

    it("shows Reply on agent messages when showReplyOn='agent'", () => {
      const onReplyTo = vi.fn();
      const agentMsg: ChatMessage = {
        id: "m-agent-2",
        text: "Outgoing line",
        time: "3:00 PM",
        sender: "agent",
        type: "text",
        status: "read",
        senderName: "Alex",
      };
      renderWithTooltip(
        <ChatBubble
          message={agentMsg}
          onReplyTo={onReplyTo}
          showReplyOn="agent"
        />
      );
      const replyBtn = screen.getByRole("button", { name: "Reply" });
      fireEvent.click(replyBtn);
      expect(onReplyTo).toHaveBeenCalledWith({
        messageId: "m-agent-2",
        sender: "Alex",
        text: "Outgoing line",
      });
    });

    it("shows Reply on both sides when showReplyOn='both'", () => {
      const customerMsg: ChatMessage = {
        id: "m-c",
        text: "From customer",
        time: "3:00 PM",
        sender: "customer",
        type: "text",
      };
      const agentMsg: ChatMessage = {
        id: "m-a",
        text: "From agent",
        time: "3:01 PM",
        sender: "agent",
        type: "text",
        status: "sent",
      };
      renderWithTooltip(
        <>
          <ChatBubble
            message={customerMsg}
            onReplyTo={vi.fn()}
            showReplyOn="both"
          />
          <ChatBubble
            message={agentMsg}
            onReplyTo={vi.fn()}
            showReplyOn="both"
          />
        </>
      );
      expect(screen.getAllByRole("button", { name: "Reply" })).toHaveLength(2);
    });

    it("renders sentBy badge outside the bubble; agent senderName is not displayed (icon tooltip carries identity)", () => {
      const msg: ChatMessage = {
        id: "m-agent-sentby",
        text: "Campaign line",
        time: "3:00 PM",
        sender: "agent",
        type: "text",
        status: "read",
        senderName: "Alex Smith",
        sentBy: { type: "campaign" },
      };
      const { container } = renderWithTooltip(<ChatBubble message={msg} />);
      // Agent senderName is NOT displayed as visible text — identity comes from the
      // sentBy icon's tooltip (`withTooltip`) instead.
      expect(screen.queryByText("Alex Smith")).not.toBeInTheDocument();
      // sentBy badge is a sibling of the bubble div in the inner flex row (items-end → bottom-aligned).
      const innerRow = container.querySelector("div.items-end");
      expect(innerRow).not.toBeNull();
      expect(innerRow?.querySelector("svg")).toBeTruthy();
      // The badge is NOT inside the bubble div (which has the rounded-lg class).
      const bubble = container.querySelector("div.rounded-lg");
      expect(bubble?.querySelector("svg[class*='lucide-megaphone']")).toBeFalsy();
    });
  });

  describe("flat mode (type prop)", () => {
    it("renders flat text variant with timestamp", () => {
      render(
        <ChatBubble
          type="text"
          variant="sender"
          timestamp="4:00 PM"
          status="read"
          text="Flat hello"
        />
      );
      expect(screen.getByText("Flat hello")).toBeInTheDocument();
      expect(screen.getByText("4:00 PM")).toBeInTheDocument();
      expect(screen.getByText("Read")).toBeInTheDocument();
    });

    it("renders location bubble with name and address", () => {
      render(
        <ChatBubble
          type="location"
          variant="receiver"
          timestamp="4:01 PM"
          location={{
            latitude: 28.6139,
            longitude: 77.209,
            name: "myOperator HQ",
            address: "Sector 65, Noida",
          }}
        />
      );
      expect(screen.getByText("myOperator HQ")).toBeInTheDocument();
      expect(screen.getByText("Sector 65, Noida")).toBeInTheDocument();
    });

    it("falls back to coordinates when location has no name/address", () => {
      render(
        <ChatBubble
          type="location"
          variant="receiver"
          timestamp="4:02 PM"
          location={{ latitude: 19.076, longitude: 72.8777 }}
        />
      );
      expect(screen.getByText("19.076000, 72.877700")).toBeInTheDocument();
    });

    it("renders contact bubble with phone and email", () => {
      render(
        <ChatBubble
          type="contact"
          variant="receiver"
          timestamp="4:03 PM"
          contactCard={{
            name: "Priya Sharma",
            phone: "+91 98765 43210",
            email: "priya@acme.co.in",
          }}
        />
      );
      expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
      expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
      expect(screen.getByText("priya@acme.co.in")).toBeInTheDocument();
    });

    it("renders referral bubble with sourceType label", () => {
      render(
        <ChatBubble
          type="referral"
          variant="receiver"
          timestamp="4:04 PM"
          referral={{
            headline: "Monsoon sale — 40% off",
            sourceType: "ad",
          }}
        />
      );
      expect(screen.getByText("Monsoon sale — 40% off")).toBeInTheDocument();
      expect(screen.getByText("Ad")).toBeInTheDocument();
    });

    it("renders list reply bubble with header and button", () => {
      render(
        <ChatBubble
          type="listReply"
          variant="sender"
          timestamp="4:05 PM"
          status="read"
          listReply={{
            header: "Pick a slot",
            body: "Choose a time",
            buttonText: "View slots",
          }}
        />
      );
      expect(screen.getByText("Pick a slot")).toBeInTheDocument();
      expect(screen.getByText("Choose a time")).toBeInTheDocument();
      expect(screen.getByText("View slots")).toBeInTheDocument();
    });

    it("renders template bubble with quick-reply buttons", () => {
      render(
        <ChatBubble
          type="template"
          variant="sender"
          timestamp="1:49 PM"
          status="read"
          text="This is your sales report."
          buttons={[
            { kind: "quickReply", label: "Interested" },
            { kind: "quickReply", label: "Not interested" },
          ]}
        />
      );
      expect(screen.getByText("This is your sales report.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Interested" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Not interested" })
      ).toBeInTheDocument();
      // Delivery footer renders BELOW the buttons — both still visible.
      expect(screen.getByText("1:49 PM")).toBeInTheDocument();
      expect(screen.getByText("Read")).toBeInTheDocument();
    });

    it("renders template url button as anchor with target=_blank", () => {
      render(
        <ChatBubble
          type="template"
          variant="sender"
          timestamp="2:00 PM"
          text="Confirm your appointment."
          buttons={[
            { kind: "url", label: "Reschedule", url: "https://example.com/r" },
          ]}
        />
      );
      const link = screen.getByRole("link", { name: /Reschedule/i });
      expect(link).toHaveAttribute("href", "https://example.com/r");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders template phone button as tel: link", () => {
      render(
        <ChatBubble
          type="template"
          variant="sender"
          timestamp="2:01 PM"
          text="Need help?"
          buttons={[
            { kind: "phone", label: "Call clinic", phone: "+919876543210" },
          ]}
        />
      );
      const link = screen.getByRole("link", { name: /Call clinic/i });
      expect(link).toHaveAttribute("href", "tel:+919876543210");
    });

    it("template without buttons keeps delivery footer in body (no button stack)", () => {
      const { container } = render(
        <ChatBubble
          type="template"
          variant="sender"
          timestamp="2:10 PM"
          status="delivered"
          text="Plain template body."
        />
      );
      expect(screen.getByText("Plain template body.")).toBeInTheDocument();
      expect(screen.getByText("Delivered")).toBeInTheDocument();
      // No template buttons rendered.
      expect(container.querySelectorAll("button").length).toBe(0);
    });

    it("flat sender alignment matches manual sender", () => {
      const { container } = render(
        <ChatBubble
          type="text"
          variant="sender"
          timestamp="4:10 PM"
          text="Aligned right"
        />
      );
      expect(container.firstElementChild).toHaveClass("justify-end");
    });

    it("invokes onReplyTo for flat customer bubble", () => {
      const onReplyTo = vi.fn();
      renderWithTooltip(
        <ChatBubble
          type="text"
          variant="receiver"
          timestamp="4:11 PM"
          text="From customer"
          messageId="cust-1"
          replyParticipantName="Jane"
          onReplyTo={onReplyTo}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "Reply" }));
      expect(onReplyTo).toHaveBeenCalledWith({
        messageId: "cust-1",
        sender: "Jane",
        text: "From customer",
      });
    });

    it("anchors messageId for scroll-to-quote in flat mode", () => {
      const { container } = render(
        <ChatBubble
          type="text"
          variant="sender"
          timestamp="4:12 PM"
          text="Anchor me"
          messageId="anchor-1"
        />
      );
      expect(container.querySelector("#msg-anchor-1")).toBeInTheDocument();
    });
  });
});
