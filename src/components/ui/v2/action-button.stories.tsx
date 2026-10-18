import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  ActionButton,
  type ActionButtonProps,
  type ActionButtonState,
} from "./action-button";
import { v2ComponentDocs } from "./story-docs";
import { gallery } from "../../../storybook/v2-preview";

type Args = ActionButtonProps & {
  delayMs: number;
  outcome: "success" | "error" | "fail-once";
};
const variants = [
  "primary",
  "secondary",
  "ghost",
  "link",
  "destructive",
] as const;

function Example({ delayMs, outcome, ...args }: Args) {
  const [state, setState] = React.useState<ActionButtonState>("idle");
  const [error, setError] = React.useState("");
  const attempts = React.useRef(0);
  const timers = React.useRef(
    new Map<ReturnType<typeof setTimeout>, () => void>()
  );
  React.useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((resolve, timer) => {
        clearTimeout(timer);
        resolve();
      });
      active.clear();
    };
  }, []);
  return (
    <div className="flex max-w-full flex-col items-center gap-4">
      <ActionButton
        {...args}
        onAction={async () => {
          attempts.current++;
          setError("");
          await args.onAction();
          await new Promise<void>((resolve) => {
            const timer = setTimeout(
              () => {
                timers.current.delete(timer);
                resolve();
              },
              Math.max(0, delayMs)
            );
            timers.current.set(timer, resolve);
          });
          if (
            outcome === "error" ||
            (outcome === "fail-once" && attempts.current === 1)
          )
            throw new Error("The draft could not be saved. Please try again.");
        }}
        onStateChange={(next) => {
          setState(next);
          args.onStateChange?.(next);
        }}
        onActionError={(reason) => {
          const message =
            reason instanceof Error ? reason.message : String(reason);
          setError(message);
          args.onActionError?.(message);
        }}
      />
      <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
        {state === "pending"
          ? "Waiting for the demo task…"
          : state === "success"
            ? "Completed. The action can be run again."
            : "Click, or use Enter or Space."}
      </p>
      {error ? (
        <p
          role="alert"
          className="m-0 max-w-[340px] text-center text-sm text-v2-semantic-error-text"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const meta: Meta<Args> = {
  title: "V2/Components/ActionButton",
  component: ActionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "variant",
        "size",
        "label",
        "pendingLabel",
        "successLabel",
        "errorLabel",
        "disabled",
        "resetAfterMs",
        "delayMs",
        "outcome",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "action-button",
          exportName: "ActionButton",
          hasV1: false,
          summary:
            "A task button that moves from an arrow to a spinner to a success check. It awaits the real promise and keeps keyboard focus throughout.",
          changes: [
            [
              "Relationship to Button",
              "No ActionButton equivalent",
              "Opt-in async behavior using the existing v2 Button styles",
            ],
            [
              "Lifecycle",
              "Managed by application code",
              "Idle → pending → success; errors return to idle",
            ],
            ["Sizes", "—", "Small 32px, default 40px, large 44px; 8px corners"],
            [
              "Variants",
              "—",
              "Five showcased styles; all Button variants accepted, default aliases primary",
            ],
          ],
          tokens: [
            ["Primary", "--semantic-primary", "343E55", "#343E55"],
            ["On primary", "--semantic-text-inverted", "FFFFFF", "#FFFFFF"],
            [
              "Neutral border",
              "--v2-button-border",
              "oklch(0.935 0 0)",
              "oklch(0.935 0 0)",
            ],
            ["Supporting text", "--v2-text-muted", "707070", "#707070"],
            ["Radius", "--radius", "8px"],
          ],
          guidance: `Use for a single Save, Publish or Submit task that should confirm completion on the action itself. Return the real promise from onAction. Use onActionError to show a visible error or toast; failures also have a screen-reader announcement. For a plain click or manually controlled loading, use Button.

This is a new v2 component, with no automatic v1 replacement. Existing Button call sites remain unchanged. The CLI installs v2-button and Motion as dependencies; v1's prefixed styles remain intact. V2 requires an unprefixed Tailwind build. Bootstrap hosts need the same important utility priority as the preview.

The default type is button, so placing it inside a form does not submit accidentally. If explicitly using type=submit, coordinate onAction with the form's onSubmit to avoid running the same request twice. Icon-only sizes and asChild are intentionally not part of this component.

resetAfterMs defaults to 2400; set 0 to retain success until another action. The accessible name remains label while a polite status region announces pending, success or failure. Label changes, arrow movement and the success stroke follow the [Arc Action Button reference](https://uiarc.dev/components/action-button), with our Button palette and radius. Reduced motion removes movement and width morphing; the loading indicator spins slowly.

\`\`\`tsx
<ActionButton
  label="Publish"
  pendingLabel="Publishing"
  successLabel="Published"
  onAction={() => publishDraft()}
  onActionError={(error) => showError(error)}
/>
\`\`\``,
        }).replace(
          "a new component from the v2 Figma library.",
          "a new, opt-in component inspired by Arc."
        ),
      },
    },
  },
  args: {
    label: "Save changes",
    pendingLabel: "Saving",
    successLabel: "Saved",
    errorLabel: "Action failed. Please try again.",
    variant: "primary",
    size: "default",
    disabled: false,
    resetAfterMs: 2400,
    delayMs: 900,
    outcome: "success",
    onAction: fn(),
    onActionError: fn(),
    onStateChange: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
      description: "Shared v2 Button style.",
    },
    size: { control: "select", options: ["sm", "default", "lg"] },
    label: {
      control: "text",
      description: "Idle label and stable accessible name.",
    },
    pendingLabel: {
      control: "text",
      description: "Visible while the promise is pending.",
    },
    successLabel: {
      control: "text",
      description: "Visible only after the promise resolves.",
    },
    errorLabel: {
      control: "text",
      description:
        "Announced on rejection. The example also shows a visible error.",
    },
    disabled: { control: "boolean" },
    resetAfterMs: {
      control: { type: "number", min: 0, step: 100 },
      description:
        "Milliseconds before returning to idle. Zero retains success.",
    },
    delayMs: {
      name: "Task duration",
      control: { type: "number", min: 0, max: 10000, step: 100 },
      table: { category: "Example" },
      description: "Demo promise duration; not a component prop.",
    },
    outcome: {
      name: "Task outcome",
      control: "select",
      options: ["success", "error", "fail-once"],
      table: { category: "Example" },
      description:
        "Simulate success, rejection, or one failed attempt followed by success.",
    },
    onAction: { control: false },
    onActionError: { control: false },
    onStateChange: { control: false },
  },
  render: (args) => <Example {...args} />,
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Link: Story = { args: { variant: "link" } };
export const Destructive: Story = {
  args: {
    variant: "destructive",
    label: "Delete draft",
    pendingLabel: "Deleting",
    successLabel: "Deleted",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstration only: no data is deleted. Use a confirmation dialog before an irreversible action.",
      },
    },
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const CustomLabels: Story = {
  name: "Custom labels",
  args: {
    label: "Publish",
    pendingLabel: "Publishing",
    successLabel: "Published",
  },
};
export const KeepSuccess: Story = {
  name: "Keep success",
  args: { resetAfterMs: 0 },
};
export const FailureAndRetry: Story = {
  name: "Failure and retry",
  args: { outcome: "fail-once" },
  parameters: {
    docs: {
      description: {
        story:
          "The first attempt fails and shows an error. Click again to complete the action successfully.",
      },
    },
  },
};
export const AllVariants: Story = {
  name: "All variants",
  parameters: {
    ...gallery(
      ["variant"],
      "Each example runs independently. Controls edit the labels, size, task duration and outcome across all five styles."
    ),
    layout: "centered",
  },
  render: (args) => (
    <div className="grid w-full max-w-[760px] grid-cols-1 gap-8 sm:grid-cols-2">
      {variants.map((variant) => (
        <div key={variant} className="flex min-w-0 flex-col items-center gap-3">
          <span className="text-sm font-medium capitalize text-[var(--v2-text-primary,#484848)]">
            {variant}
          </span>
          <Example {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  name: "All sizes",
  parameters: {
    ...gallery(
      ["size"],
      "Three text sizes matching Button. Each sample runs independently; all other controls stay live."
    ),
    layout: "centered",
  },
  render: (args) => (
    <div className="flex max-w-full flex-wrap justify-center gap-8">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <span className="text-sm text-[var(--v2-text-muted,#707070)]">
            {size} · {size === "sm" ? 32 : size === "lg" ? 44 : 40}px
          </span>
          <Example {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

function StateSample({
  phase,
  ...args
}: ActionButtonProps & { phase: ActionButtonState | "disabled" }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (phase !== "pending" && phase !== "success") return;
    const timer = setTimeout(() => ref.current?.click(), 0);
    return () => clearTimeout(timer);
  }, [phase]);
  return (
    <ActionButton
      {...args}
      ref={ref}
      disabled={phase === "disabled"}
      resetAfterMs={0}
      onAction={() =>
        phase === "pending" ? new Promise(() => {}) : Promise.resolve()
      }
    />
  );
}
export const States: Story = {
  parameters: {
    ...gallery(
      ["disabled", "resetAfterMs", "delayMs", "outcome", "errorLabel"],
      "Fixed state comparison. Pending intentionally remains busy; success stays visible. Palette, size and all three visible labels remain editable."
    ),
    layout: "centered",
  },
  render: ({ delayMs: _delay, outcome: _outcome, ...args }) => (
    <div className="grid max-w-full grid-cols-1 gap-8 sm:grid-cols-2">
      {(["idle", "pending", "success", "disabled"] as const).map((phase) => (
        <div key={phase} className="flex flex-col items-center gap-3">
          <span className="text-sm capitalize text-[var(--v2-text-muted,#707070)]">
            {phase}
          </span>
          <StateSample {...args} phase={phase} />
        </div>
      ))}
    </div>
  ),
};
export const Usage: Story = {
  args: {
    label: "Publish reply",
    pendingLabel: "Publishing",
    successLabel: "Published",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A composed example for a real task. Changes to labels, styles, disabled state, timing and outcome apply to the action below.",
      },
    },
  },
  render: (args) => (
    <section className="w-[440px] max-w-full space-y-5 rounded-xl border border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-6">
      <div className="space-y-2">
        <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
          Ready to publish
        </h3>
        <p className="m-0 text-sm text-[var(--v2-text-secondary,#5E5E5E)]">
          Your saved reply is ready for the team. This demo changes no real
          data.
        </p>
      </div>
      <Example {...args} />
    </section>
  ),
};
export const KeyboardInteraction: Story = {
  name: "Keyboard interaction",
  args: { delayMs: 80, resetAfterMs: 0 },
  tags: ["!autodocs"],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save changes" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(button).toHaveAttribute("data-state", "success")
    );
    await expect(button).toHaveFocus();
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(" ");
    await waitFor(() => expect(args.onAction).toHaveBeenCalledTimes(2));
  },
};
