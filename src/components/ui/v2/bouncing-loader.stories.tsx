import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BouncingLoader, type BouncingLoaderProps } from "./bouncing-loader";
import { BouncingLoader as V1 } from "../bouncing-loader";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const meta: Meta<typeof BouncingLoader> = {
  title: "V2/Components/BouncingLoader",
  component: BouncingLoader,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2185-13995",
    },
    layout: "centered",
    controls: { include: ["size", "spacing", "color", "aria-label"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "bouncing-loader",
          summary:
            "A three-dot loading indicator with configurable dot size, spacing and color.",
          changes: [
            [
              "Shape and motion",
              "Three bouncing dots",
              "A quiet 3px wave with a softer opacity change",
            ],
            ["Defaults", "8px dots, 0.375rem spacing", "Same size and spacing"],
            [
              "Motion preference",
              "Continuous animation",
              "Static dots with reduced motion; paused offscreen and on hidden pages",
            ],
            [
              "Decorative use",
              "Default named status",
              "aria-hidden or presentation removes default announcements",
            ],
            ["Namespace", "ui/bouncing-loader", "ui/v2/bouncing-loader"],
          ],
          tokens: [
            [
              "Dot fill override",
              "--bouncing-loader-color",
              "var(--v2-semantic-text-placeholder,var(--semantic-text-placeholder))",
              "#A2A6B1",
            ],
            ["Dot diameter", "--bouncing-loader-size", "8px"],
            ["Dot spacing", "--bouncing-loader-spacing", "0.375rem"],
          ],
          guidance:
            "Use one loader per pending operation and give it a specific aria-label. If a button or parent status already describes the operation, use aria-hidden on the loader. Size and spacing accept pixel numbers or CSS lengths; their v1 defaults are preserved. Reduced motion shows static dots, and offscreen or hidden-page dots pause. Completion is controlled by your operation, never by the animation.",
        }),
      },
    },
  },
  args: {
    size: 8,
    spacing: 6,
    color:
      "var(--v2-semantic-text-placeholder,var(--semantic-text-placeholder))",
    "aria-label": "Sending draft",
  },
  argTypes: {
    size: { control: { type: "number", min: 2, max: 32 } },
    spacing: { control: { type: "number", min: 0, max: 24 } },
    color: { control: "text" },
    "aria-label": { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
const INITIAL_DRAFT =
  "Thanks for reaching out. I’m checking this and will reply shortly.";

function SendingDraft(args: BouncingLoaderProps) {
  const [draft, setDraft] = useState(INITIAL_DRAFT);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const sending = state === "sending";

  return (
    <section className="w-[480px] max-w-full space-y-5 rounded-xl border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-5 text-v2-semantic-text-primary">
      <header className="space-y-1">
        <h3 className="m-0 text-base font-semibold">Send a reply</h3>
        <p className="m-0 text-sm text-v2-semantic-text-muted">
          A local preview. Start sending, then finish when you’re ready.
        </p>
      </header>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (draft.trim() && !sending) setState("sending");
        }}
      >
        <label className="block space-y-2 text-sm font-medium">
          <span>Draft reply</span>
          <textarea
            value={draft}
            readOnly={sending}
            onChange={(event) => {
              setDraft(event.target.value);
              if (state === "sent") setState("idle");
            }}
            className="block min-h-28 w-full resize-y rounded-lg border border-solid border-v2-semantic-border-input bg-v2-semantic-bg-primary p-3 text-sm font-normal leading-relaxed text-v2-semantic-text-primary outline-none focus-visible:border-v2-semantic-border-focus focus-visible:ring-1 focus-visible:ring-v2-semantic-border-focus"
          />
        </label>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="flex min-h-12 items-center gap-3 rounded-lg bg-v2-semantic-bg-ui px-4 py-3 text-sm text-v2-semantic-text-secondary"
        >
          {sending && <BouncingLoader {...args} aria-hidden="true" />}
          <span>
            {sending
              ? (args["aria-label"] ?? "Sending draft")
              : state === "sent"
                ? "Draft sent in this preview."
                : "Your draft is ready to send."}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={sending || !draft.trim()}
            aria-busy={sending}
          >
            Start sending
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!sending}
            onClick={() => setState("sent")}
          >
            Finish sending
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setState("idle");
              setDraft(INITIAL_DRAFT);
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </section>
  );
}

export const Overview: Story = {
  render: (args) => <SendingDraft {...args} />,
};
export const Default: Story = {
  render: (args) => <BouncingLoader {...args} />,
};
export const LargerDots: Story = { args: { size: 12, spacing: 8 } };
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "Fixed dot diameters. Spacing and color apply to each sample."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-center gap-8">
      {[6, 8, 12, 16].map((size) => (
        <section key={size} className="space-y-3">
          <h3 className="m-0 text-sm font-medium">{size}px</h3>
          <BouncingLoader {...args} size={size} />
        </section>
      ))}
    </div>
  ),
};
export const AllVariants: Story = {
  parameters: gallery(
    ["color"],
    "Placeholder, muted and primary semantic colors. Size and spacing stay editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap gap-8">
      {["placeholder", "muted", "secondary"].map((color) => (
        <section key={color} className="space-y-3">
          <h3 className="m-0 text-sm font-medium capitalize">{color}</h3>
          <BouncingLoader
            {...args}
            color={`var(--v2-semantic-text-,var(--semantic-text-${color}))`}
          />
        </section>
      ))}
    </div>
  ),
};
export const Usage: Story = {
  render: (args) => <SendingDraft {...args} />,
};
export const InButton: Story = {
  render: (args) => (
    <Button type="button" disabled aria-busy="true">
      <BouncingLoader {...args} color="currentColor" aria-hidden="true" />
      Sending draft
    </Button>
  ),
};
export const Decorative: Story = {
  render: (args) => (
    <div role="status" aria-live="polite" className="flex items-center gap-3">
      <BouncingLoader {...args} aria-hidden="true" />
      <span className="text-sm text-v2-semantic-text-secondary">
        Checking availability
      </span>
    </div>
  ),
};
export const NativeStyles: Story = {
  render: (args) => (
    <BouncingLoader
      {...args}
      id="native-style-loader"
      title="A slower wave with caller styles"
      size="0.75rem"
      spacing="0.5rem"
      tabIndex={0}
      style={{ animationDuration: "1.8s", padding: "12px", opacity: 0.9 }}
      className="rounded-lg border border-solid border-v2-semantic-border-layout focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-v2-semantic-border-focus"
    />
  ),
};
export const Paused: Story = {
  render: (args) => (
    <BouncingLoader {...args} style={{ animationPlayState: "paused" }} />
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  render: (args) => (
    <div className="grid w-[720px] max-w-full gap-6 md:grid-cols-2">
      {["v1", "v2"].map((version) => (
        <section
          key={version}
          className="min-w-0 space-y-3 rounded-lg border border-solid border-v2-semantic-border-layout p-5"
        >
          <h3 className="m-0 text-base font-medium">{version}</h3>
          {version === "v1" ? <V1 {...args} /> : <BouncingLoader {...args} />}
        </section>
      ))}
    </div>
  ),
};
