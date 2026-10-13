import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Spinner, type SpinnerProps } from "./spinner";
import { Spinner as V1 } from "../spinner";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const variants = [
  "default",
  "secondary",
  "muted",
  "inverted",
  "current",
] as const;
const sizes = ["sm", "default", "lg", "xl"] as const;
const meta: Meta<typeof Spinner> = {
  title: "V2/Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-12231",
    },
    layout: "centered",
    controls: { include: ["variant", "size", "aria-label"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "spinner",
          summary:
            "Animated loading indicators with four sizes and five color treatments.",
          changes: [
            ["Shape", "Track and quarter arc", "Inset open ring"],
            [
              "Motion",
              "Always rotates",
              "Pauses when hidden; static under reduced motion",
            ],
            [
              "Accessibility",
              "Named status",
              "Same default; aria-hidden removes decorative announcements",
            ],
            ["Namespace", "ui/spinner", "ui/v2/spinner"],
          ],
          tokens: [
            ["Primary", "--semantic-primary", "343E55", "#343E55"],
            ["Muted", "--semantic-text-muted", "717680", "#717680"],
            ["Inverted", "--semantic-text-inverted", "FFFFFF", "#FFFFFF"],
          ],
          guidance:
            "Provide a specific aria-label such as Saving changes. Use current to inherit color inside a control, and aria-hidden when visible text or a parent status already announces loading. The open ring stays visible without rotation under reduced motion. Native div props, refs, sizes and variant names remain compatible with v1.",
        }),
      },
    },
  },
  args: {
    variant: "default",
    size: "default",
    "aria-label": "Loading conversations",
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: sizes },
    "aria-label": { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div
      className={
        args.variant === "inverted"
          ? "rounded-lg bg-semantic-primary p-4 text-semantic-text-inverted"
          : "p-4"
      }
    >
      <Spinner {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: (args) => <LoadingExample {...args} />,
};
export const Default: Story = { args: { variant: "default" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Muted: Story = { args: { variant: "muted" } };
export const Inverted: Story = { args: { variant: "inverted" } };
export const Current: Story = { args: { variant: "current" } };
export const Small: Story = { args: { size: "sm" } };
export const DefaultSize: Story = { args: { size: "default" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "All palette variants. Size and accessible label update every sample."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-center gap-6">
      {variants.map((variant) => (
        <section
          key={variant}
          className={
            variant === "inverted"
              ? "space-y-3 rounded-lg bg-semantic-primary p-4 text-semantic-text-inverted"
              : "space-y-3 p-4"
          }
        >
          <h3 className="m-0 text-sm font-medium capitalize">{variant}</h3>
          <Spinner {...args} variant={variant} />
        </section>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "16, 24, 32 and 48px indicators. Palette and accessible label stay editable."
  ),
  render: (args) => (
    <div className="flex max-w-full flex-wrap items-center gap-8">
      {sizes.map((size) => (
        <section key={size} className="space-y-3">
          <h3 className="m-0 text-sm font-medium">{size}</h3>
          <Spinner {...args} size={size} />
        </section>
      ))}
    </div>
  ),
};
function LoadingExample(args: SpinnerProps) {
  const [state, setState] = useState<"idle" | "loading" | "complete">(
    "loading"
  );
  const loading = state === "loading";
  return (
    <section className="w-[420px] max-w-full space-y-4 text-semantic-text-primary">
      <div className="space-y-1">
        <h3 className="m-0 text-base font-semibold">Team inbox</h3>
        <p className="m-0 text-sm text-semantic-text-muted">
          Load a local sample, then complete the preview.
        </p>
      </div>
      <div
        className="flex min-h-[168px] items-center rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary p-4"
        aria-busy={loading}
      >
        {loading ? (
          <div className="flex w-full items-center gap-3">
            <div
              className={
                args.variant === "inverted"
                  ? "inline-flex rounded-lg bg-semantic-primary p-3 text-semantic-text-inverted"
                  : "inline-flex rounded-lg bg-semantic-bg-ui p-3"
              }
            >
              <Spinner {...args} />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="m-0 text-sm font-medium">
                Loading sample conversations…
              </p>
              <p className="m-0 text-sm text-semantic-text-muted">
                Complete the preview to see the inbox.
              </p>
            </div>
          </div>
        ) : state === "complete" ? (
          <ul className="m-0 grid w-full list-none gap-3 p-0">
            {[
              ["Riya Sharma", "Asked about the team plan"],
              ["Karan Mehta", "Requested a callback"],
              ["Amira Khan", "Shared a billing question"],
            ].map(([name, message]) => (
              <li key={name} className="min-w-0 space-y-0.5">
                <p className="m-0 text-sm font-medium">{name}</p>
                <p className="m-0 text-sm text-semantic-text-muted">
                  {message}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-sm text-semantic-text-secondary">
            Ready to load three sample conversations.
          </p>
        )}
      </div>
      <p role="status" className="m-0 sr-only">
        {state === "complete"
          ? "Three sample conversations are ready."
          : state === "idle"
            ? "Loading preview reset."
            : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setState("loading")}
          disabled={loading}
        >
          Start loading
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setState("complete")}
          disabled={!loading}
        >
          Complete loading
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setState("idle")}
          disabled={state === "idle"}
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
export const Usage: Story = { render: (args) => <LoadingExample {...args} /> };
export const Decorative: Story = {
  render: (args) => (
    <div
      role="status"
      className="flex items-center gap-2 text-semantic-text-secondary"
    >
      <Spinner {...args} size="sm" variant="current" aria-hidden="true" />
      <span className="text-sm">Saving draft…</span>
    </div>
  ),
};
export const CallerStyles: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex items-center gap-3">
        <Spinner
          {...args}
          aria-label="Loading with a slower rotation"
          style={{ animationDuration: "1.4s" }}
        />
        <span className="text-sm">Slower rotation</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner
          {...args}
          aria-label="Paused loading preview"
          style={{ animationPlayState: "paused" }}
        />
        <span className="text-sm">Paused</span>
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  render: (args) => (
    <div className="grid w-[720px] max-w-full gap-6 md:grid-cols-2">
      {["v1", "v2"].map((version) => (
        <section
          key={version}
          className="min-w-0 space-y-3 rounded-lg border border-solid border-semantic-border-layout p-5"
        >
          <h3 className="m-0 text-base font-medium">{version}</h3>
          {version === "v1" ? <V1 {...args} /> : <Spinner {...args} />}
        </section>
      ))}
    </div>
  ),
};
