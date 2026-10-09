import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ShimmeringText, type ShimmeringTextProps } from "./shimmering-text";
import { Button } from "./button";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";
const meta: Meta<typeof ShimmeringText> = {
  title: "V2/Components/ShimmeringText",
  component: ShimmeringText,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { include: ["children", "active"] },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "shimmering-text",
          hasV1: false,
          summary:
            "A short loading status with a moving highlight and a reduced-motion fallback.",
          changes: [
            ["Text", "—", "Inter 16px; normal line height"],
            ["Highlight", "—", "Light sweep across text"],
            ["Motion", "—", "Disabled for reduced-motion preferences"],
          ],
          tokens: [
            ["Text", "--semantic-text-secondary", "#343E55", "#343E55"],
            ["Highlight", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
          ],
          guidance:
            "Keep status text meaningful and brief. active turns the highlight off; role=status announces updated text politely. Figma's four variants describe successive animation frames, rather than four color palettes.",
        }),
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=3217-102530",
    },
  },
  args: { children: "Loading. Please wait", active: true },
  argTypes: { children: { control: "text" }, active: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Paused: Story = { args: { active: false } };
export const Importing: Story = { args: { children: "Importing contacts…" } };
export const AllVariants: Story = {
  parameters: gallery(
    ["active"],
    "Animated and static presentations. The text control updates both."
  ),
  render: (args) => (
    <div className="grid w-[600px] max-w-full gap-6 sm:grid-cols-2">
      {[true, false].map((active) => (
        <section key={String(active)} className="space-y-3">
          <h3 className="m-0 text-base font-medium">
            {active ? "Animated" : "Static"}
          </h3>
          <ShimmeringText {...args} active={active} />
          <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
            {active
              ? "Motion follows the user's preference."
              : "The same status without the highlight."}
          </p>
        </section>
      ))}
    </div>
  ),
};
export const States: Story = AllVariants;
function ImportExample(args: ShimmeringTextProps) {
  const [stage, setStage] = useState<"idle" | "loading" | "complete">("idle");
  return (
    <section className="w-80 max-w-full space-y-4">
      <div>
        <h3 className="m-0 text-base font-medium">Contact import</h3>
        <p className="m-0 mt-1 text-xs text-[var(--v2-text-muted,#707070)]">
          Start and complete the import locally.
        </p>
      </div>
      {stage === "loading" ? (
        <ShimmeringText {...args} />
      ) : (
        <p
          role="status"
          className="m-0 text-sm text-[var(--v2-text-secondary,#5E5E5E)]"
        >
          {stage === "complete" ? "Contacts imported." : "Ready to import."}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setStage(stage === "loading" ? "complete" : "loading")}
        >
          {stage === "loading" ? "Complete import" : "Start import"}
        </Button>
        <Button variant="outline" onClick={() => setStage("idle")}>
          Reset
        </Button>
      </div>
    </section>
  );
}
export const Usage: Story = {
  parameters: gallery(
    [],
    "A local loading workflow. Text and animation controls apply during the loading stage."
  ),
  render: (args) => <ImportExample {...args} />,
};
