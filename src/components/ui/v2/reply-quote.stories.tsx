import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { clearAllMocks, expect, fn, userEvent, within } from "storybook/test";
import { ReplyQuote, type ReplyQuoteProps } from "./reply-quote";
import { ReplyQuote as QuoteV1 } from "../reply-quote";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const thumb =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88"><rect width="88" height="88" rx="8" fill="#ECF1FB"/><path d="M20 60h48L50 30 37 46 30 38z" fill="#27ABB8"/></svg>'
  );
type Args = Omit<ReplyQuoteProps, "message" | "onClick"> & {
  onClick?: () => void;
  message: string;
  interactive: boolean;
  withThumbnail: boolean;
  activated: boolean;
};
function quoteProps(args: Args) {
  const { interactive, withThumbnail, activated, onClick, ...props } = args;
  void [interactive, withThumbnail, activated];
  return { ...props, onClick: onClick ? () => onClick() : undefined };
}
// Generated from current v1 source with Tailwind 3, prefix tw-, and no preflight.
// The scope keeps these legacy utilities inside the v1 comparison only.
const legacyQuoteCss =
  ".v2-reply-quote-v1-comparison .tw-m-0 {\n    margin: 0px\n}\n.v2-reply-quote-v1-comparison .tw-mb-2 {\n    margin-bottom: 0.5rem\n}\n.v2-reply-quote-v1-comparison .tw-line-clamp-1 {\n    overflow: hidden;\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 1\n}\n.v2-reply-quote-v1-comparison .tw-flex {\n    display: flex\n}\n.v2-reply-quote-v1-comparison .tw-size-11 {\n    width: 2.75rem;\n    height: 2.75rem\n}\n.v2-reply-quote-v1-comparison .tw-h-\\[56px\\] {\n    height: 56px\n}\n.v2-reply-quote-v1-comparison .tw-w-full {\n    width: 100%\n}\n.v2-reply-quote-v1-comparison .tw-min-w-0 {\n    min-width: 0px\n}\n.v2-reply-quote-v1-comparison .tw-flex-1 {\n    flex: 1 1 0%\n}\n.v2-reply-quote-v1-comparison .tw-shrink-0 {\n    flex-shrink: 0\n}\n.v2-reply-quote-v1-comparison .tw-cursor-pointer {\n    cursor: pointer\n}\n.v2-reply-quote-v1-comparison .tw-flex-row {\n    flex-direction: row\n}\n.v2-reply-quote-v1-comparison .tw-flex-col {\n    flex-direction: column\n}\n.v2-reply-quote-v1-comparison .tw-items-center {\n    align-items: center\n}\n.v2-reply-quote-v1-comparison .tw-justify-start {\n    justify-content: flex-start\n}\n.v2-reply-quote-v1-comparison .tw-gap-0 {\n    gap: 0px\n}\n.v2-reply-quote-v1-comparison .tw-gap-2 {\n    gap: 0.5rem\n}\n.v2-reply-quote-v1-comparison .tw-overflow-hidden {\n    overflow: hidden\n}\n.v2-reply-quote-v1-comparison .tw-truncate {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap\n}\n.v2-reply-quote-v1-comparison .tw-rounded-sm {\n    border-radius: calc(var(--radius) - 4px)\n}\n.v2-reply-quote-v1-comparison .tw-border-b-0 {\n    border-bottom-width: 0px\n}\n.v2-reply-quote-v1-comparison .tw-border-l-\\[3px\\] {\n    border-left-width: 3px\n}\n.v2-reply-quote-v1-comparison .tw-border-r-0 {\n    border-right-width: 0px\n}\n.v2-reply-quote-v1-comparison .tw-border-t-0 {\n    border-top-width: 0px\n}\n.v2-reply-quote-v1-comparison .tw-border-solid {\n    border-style: solid\n}\n.v2-reply-quote-v1-comparison .tw-border-\\[var\\(--semantic-border-accent\\,\\#27ABB8\\)\\] {\n    border-color: var(--semantic-border-accent,#27ABB8)\n}\n.v2-reply-quote-v1-comparison .tw-bg-\\[var\\(--semantic-bg-ui\\,\\#F5F5F5\\)\\] {\n    background-color: var(--semantic-bg-ui,#F5F5F5)\n}\n.v2-reply-quote-v1-comparison .tw-object-cover {\n    object-fit: cover\n}\n.v2-reply-quote-v1-comparison .tw-px-4 {\n    padding-left: 1rem;\n    padding-right: 1rem\n}\n.v2-reply-quote-v1-comparison .tw-py-1\\.5 {\n    padding-top: 0.375rem;\n    padding-bottom: 0.375rem\n}\n.v2-reply-quote-v1-comparison .tw-text-left {\n    text-align: left\n}\n.v2-reply-quote-v1-comparison .tw-text-\\[14px\\] {\n    font-size: 14px\n}\n.v2-reply-quote-v1-comparison .tw-font-semibold {\n    font-weight: 600\n}\n.v2-reply-quote-v1-comparison .tw-leading-5 {\n    line-height: 1.25rem\n}\n.v2-reply-quote-v1-comparison .tw-tracking-\\[0\\.014px\\] {\n    letter-spacing: 0.014px\n}\n.v2-reply-quote-v1-comparison .tw-text-\\[var\\(--semantic-text-muted\\,\\#717680\\)\\] {\n    color: var(--semantic-text-muted,#717680)\n}\n.v2-reply-quote-v1-comparison .tw-text-\\[var\\(--semantic-text-primary\\,\\#181D27\\)\\] {\n    color: var(--semantic-text-primary,#181D27)\n}\n.v2-reply-quote-v1-comparison .tw-transition-colors {\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transition-duration: 150ms\n}\n@keyframes enter {\n    from {\n        opacity: var(--tw-enter-opacity, 1);\n        transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))\n    }\n}\n@keyframes exit {\n    to {\n        opacity: var(--tw-exit-opacity, 1);\n        transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))\n    }\n}\n.v2-reply-quote-v1-comparison .hover\\:tw-bg-\\[var\\(--semantic-bg-hover\\2c \\#D5D7DA\\)\\]:hover {\n    background-color: var(--semantic-bg-hover,#D5D7DA)\n}\n.v2-reply-quote-v1-comparison .focus-visible\\:tw-outline-none:focus-visible {\n    outline: 2px solid transparent;\n    outline-offset: 2px\n}\n.v2-reply-quote-v1-comparison .focus-visible\\:tw-ring-2:focus-visible {\n    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)\n}\n.v2-reply-quote-v1-comparison .focus-visible\\:tw-ring-\\[var\\(--semantic-border-focus\\2c \\#2BBCCA\\)\\]:focus-visible {\n    --tw-ring-color: var(--semantic-border-focus,#2BBCCA)\n}\n.v2-reply-quote-v1-comparison .focus-visible\\:tw-ring-offset-1:focus-visible {\n    --tw-ring-offset-width: 1px\n}";
const meta: Meta<Args> = {
  title: "V2/Components/ReplyQuote",
  component: ReplyQuote,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: {
      include: ["sender", "message", "interactive", "withThumbnail", "onClick"],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "reply-quote",
          summary:
            "A bounded quoted-message preview with a sender, one-line message and optional thumbnail.",
          changes: [
            ["Tailwind", "tw- utilities", "Unprefixed v2 utilities"],
            [
              "Typography",
              "Inherited Source Sans",
              "Inter; existing 14px sender/message",
            ],
            [
              "Dimensions",
              "56px quote, 3px accent border, 44px thumbnail",
              "Preserved",
            ],
            [
              "Interaction",
              "Native button when onClick exists",
              "Preserved, with Enter and Space activation",
            ],
          ],
          tokens: [
            ["Surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Accent border", "--semantic-border-accent", "#27ABB8", "#27ABB8"],
            ["Message text", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
            ["Geometry", "height / border / thumbnail", "56px / 3px / 44px"],
          ],
          guidance:
            "Without onClick the quote is static. With onClick it becomes a native button with an accessible label. Usage reveals the original message locally; it does not alter scrolling in a host application. Example toggles control interactive and thumbnail composition.",
        }),
      },
    },
  },
  args: {
    sender: "Mira Shah",
    message: "Could you send the delivery receipt?",
    interactive: false,
    withThumbnail: false,
    thumbnailUrl: thumb,
    activated: false,
    onClick: fn(),
  },
  argTypes: {
    sender: { control: "text" },
    message: { control: "text" },
    interactive: { control: "boolean", table: { category: "Example" } },
    withThumbnail: { control: "boolean", table: { category: "Example" } },
    onClick: { control: false },
    activated: { control: "boolean", table: { category: "Example" } },
    thumbnailUrl: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return (
      <div className="max-w-lg">
        <ReplyQuote
          {...quoteProps(args)}
          thumbnailUrl={args.withThumbnail ? args.thumbnailUrl : undefined}
          onClick={
            args.interactive
              ? () => {
                  args.onClick?.();
                  update({ activated: true });
                }
              : undefined
          }
        />
        {args.activated && args.interactive && (
          <p className="m-0 mt-2 text-xs text-[var(--v2-text-muted,#707070)]">
            Quote activated
          </p>
        )}
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Interactive: Story = { args: { interactive: true } };
export const WithThumbnail: Story = { args: { withThumbnail: true } };
export const LongText: Story = {
  args: {
    sender: "Mira Shah — Customer Support Operations",
    message:
      "Could you send the complete delivery receipt and tracking details for the package we discussed earlier today?",
  },
};
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 mb-3 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        {title}
      </h3>
      {children}
    </section>
  );
}
export const AllCompositions: Story = {
  name: "All compositions",
  parameters: gallery(
    ["interactive", "withThumbnail"],
    "Static/interactive and thumbnail axes are fixed. Sender and message Controls apply to every quote."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4 md:grid-cols-2">
      {[false, true].flatMap((interactive) =>
        [false, true].map((withThumbnail) => (
          <Card
            key={`${interactive}-${withThumbnail}`}
            title={`${interactive ? "Interactive" : "Static"}${withThumbnail ? " with thumbnail" : " text"}`}
          >
            <ReplyQuote
              {...quoteProps(args)}
              thumbnailUrl={withThumbnail ? args.thumbnailUrl : undefined}
              onClick={interactive ? () => args.onClick?.() : undefined}
            />
          </Card>
        ))
      )}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["interactive"],
    "Interactive state is fixed. Hover and focus are forced styles; sender, message and thumbnail Controls remain editable."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4 md:grid-cols-3">
      {[
        { name: "Default", cls: "" },
        { name: "Hovered", cls: "pseudo-hover" },
        { name: "Keyboard focus", cls: "pseudo-focus-visible" },
      ].map((s) => (
        <Card title={s.name} key={s.name}>
          <ReplyQuote
            {...quoteProps(args)}
            thumbnailUrl={args.withThumbnail ? args.thumbnailUrl : undefined}
            onClick={() => args.onClick?.()}
            className={s.cls}
          />
        </Card>
      ))}
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    [],
    "Both versions receive identical quote text, thumbnail and interactive Controls."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-2 gap-4">
        <Card title="v1">
          <div className="v2-reply-quote-v1-comparison">
            <style>{legacyQuoteCss}</style>
            <QuoteV1
              {...quoteProps(args)}
              thumbnailUrl={args.withThumbnail ? args.thumbnailUrl : undefined}
              onClick={args.interactive ? () => args.onClick?.() : undefined}
              className="font-sans"
            />
          </div>
        </Card>
        <Card title="v2">
          <ReplyQuote
            {...quoteProps(args)}
            thumbnailUrl={args.withThumbnail ? args.thumbnailUrl : undefined}
            onClick={args.interactive ? () => args.onClick?.() : undefined}
          />
        </Card>
      </div>
    </div>
  ),
};
export const Usage: Story = {
  args: { interactive: true },
  parameters: {
    controls: { include: ["sender", "message", "withThumbnail", "activated"] },
  },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return (
      <section className="max-w-xl rounded-lg border border-semantic-border-layout p-4">
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Reply to a message
        </h3>
        <p className="m-0 mt-1 mb-4 text-xs text-[var(--v2-text-muted,#707070)]">
          Activate the quote to reveal the original message.
        </p>
        <ReplyQuote
          sender={args.sender}
          message={args.message}
          thumbnailUrl={args.withThumbnail ? args.thumbnailUrl : undefined}
          onClick={() => {
            args.onClick?.();
            update({ activated: !args.activated });
          }}
        />
        <div className="rounded-lg bg-semantic-primary-surface p-3">
          <p className="m-0 text-sm">
            Yes, the receipt is attached to this reply.
          </p>
        </div>
        {args.activated && (
          <div className="mt-4 rounded-lg border border-semantic-border-accent p-3">
            <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
              Original message
            </p>
            <p className="m-0 mt-2 text-sm font-medium">{args.sender}</p>
            <p className="m-0 mt-1 text-sm">{args.message}</p>
          </div>
        )}
      </section>
    );
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    sender: "Mira Shah",
    message: "Could you send the delivery receipt?",
    interactive: true,
    withThumbnail: false,
  },
  parameters: {
    // Activating the quote updates Controls, which re-renders the story; keep the spy history through that.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Plays a real click and Enter/Space activation against the action spy. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const quote = canvas.getByRole("button", {
      name: "Quoted reply from Mira Shah: Could you send the delivery receipt?",
    });

    await step("An interactive quote is a labelled native button", async () => {
      await expect(quote.tagName).toBe("BUTTON");
      await expect(quote).toHaveAttribute("type", "button");
      await expect(canvas.getByText("Mira Shah")).toBeVisible();
    });

    await step("A click activates it", async () => {
      await userEvent.click(quote);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
      await expect(await canvas.findByText("Quote activated")).toBeVisible();
    });

    await step("Enter and Space activate it; other keys do not", async () => {
      quote.focus();
      await userEvent.keyboard("a{Escape}");
      await expect(args.onClick).toHaveBeenCalledTimes(1);
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(args.onClick).toHaveBeenCalledTimes(3);
    });
  },
};
