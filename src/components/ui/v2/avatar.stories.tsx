import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { Phone, UserRound } from "lucide-react";
import { Avatar, type AvatarProps } from "./avatar";
import { Avatar as AvatarV1 } from "../avatar";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = AvatarProps & { customContent: "none" | "person" | "phone" };
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const variants = ["soft", "outline", "filled"] as const;
const statuses = [undefined, "online", "offline", "busy", "away"] as const;
const portrait =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#ECF1FB"/><circle cx="32" cy="25" r="11" fill="#717680"/><path d="M10 64a22 22 0 0 1 44 0" fill="#343E55"/></svg>'
  );
function Sample({
  args,
  version = "v2",
}: {
  args: Args;
  version?: "v1" | "v2";
}) {
  const { customContent, ...props } = args;
  const content =
    customContent === "person" ? (
      <UserRound className="size-4" />
    ) : customContent === "phone" ? (
      <Phone className="size-4" />
    ) : undefined;
  return version === "v1" ? (
    <AvatarV1
      {...props}
      variant={args.variant === "outline" ? "soft" : args.variant}
      className="font-sans"
    >
      {content}
    </AvatarV1>
  ) : (
    <Avatar {...props}>{content}</Avatar>
  );
}
const meta: Meta<Args> = {
  title: "V2/Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=924-9983",
    },
    layout: "padded",
    controls: {
      include: [
        "name",
        "initials",
        "src",
        "alt",
        "variant",
        "size",
        "status",
        "customContent",
      ],
    },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "avatar",
          summary:
            "User identity with images, generated or explicit initials, custom content and optional presence dots.",
          changes: [
            ["Soft surface", "Grey", "Info surface #ECF1FB"],
            ["Small size", "32px", "30px"],
            ["Type", "Semibold inherited font", "Medium Inter"],
            ["Outline", "Custom styling", "Named outline variant"],
            [
              "Props",
              "Identity and presence props",
              "Existing name/src/alt/initials/status/children retained",
            ],
          ],
          tokens: [
            ["Soft surface", "--semantic-info-surface", "#ECF1FB", "#ECF1FB"],
            ["Filled surface", "--semantic-primary", "#343E55", "#343E55"],
            ["Outline", "--semantic-border-layout", "#E9EAEB", "#E9EAEB"],
            ["Online", "--semantic-success-primary", "#17B26A", "#17B26A"],
            ["Busy", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Away", "--semantic-warning-primary", "#FDB022", "#FDB022"],
          ],
          guidance:
            "Provide name for generated initials and the accessible label. src takes precedence over custom children and initials. Supply a usable image URL; image-error fallback is unchanged from v1. Presence is a visual dot, so add a text status in the surrounding UI where users need that information. customContent composes children in this example and is not an Avatar prop.",
        }),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]">
        <Story />
      </div>
    ),
  ],
  args: {
    name: "Aditi Kumar",
    initials: "",
    src: "",
    alt: "",
    variant: "soft",
    size: "md",
    status: undefined,
    customContent: "none",
  },
  argTypes: {
    name: { control: "text" },
    initials: {
      control: "text",
      description:
        "An empty string in this playground uses generated initials.",
    },
    src: { control: "text" },
    alt: { control: "text", description: "Empty uses name." },
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    status: { control: "select", options: statuses },
    customContent: {
      control: "select",
      options: ["none", "person", "phone"],
      table: { category: "Example" },
    },
  },
  render: (args) => (
    <Sample
      args={{
        ...args,
        initials: args.initials || undefined,
        alt: args.alt || undefined,
      }}
    />
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const ExtraSmall: Story = { args: { size: "xs" } };
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const Soft: Story = { args: { variant: "soft" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Filled: Story = { args: { variant: "filled" } };
export const WithImage: Story = {
  args: { src: portrait, alt: "Illustrated profile" },
};
export const WithCustomInitials: Story = { args: { initials: "CS" } };
export const CustomContent: Story = { args: { customContent: "person" } };
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col items-center gap-4 rounded-lg border border-semantic-border-layout p-5">
      <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}
function normalized(args: Args): Args {
  return {
    ...args,
    initials: args.initials || undefined,
    alt: args.alt || undefined,
  };
}
export const AllSizes: Story = {
  parameters: gallery(
    ["size"],
    "All five sizes are fixed. Identity, image, content, variant and presence controls apply to every sample."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[700px] grid-cols-5 gap-4">
        {sizes.map((size) => (
          <Card key={size} title={size}>
            <Sample args={{ ...normalized(args), size }} />
            <p className="m-0 text-xs text-semantic-text-muted">
              {{ xs: 24, sm: 30, md: 40, lg: 48, xl: 64 }[size]}px
            </p>
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const AllVariants: Story = {
  parameters: gallery(
    ["variant"],
    "Soft, Outline and Filled are fixed. Other controls remain live."
  ),
  render: (args) => (
    <div className="grid max-w-full grid-cols-3 gap-4">
      {variants.map((variant) => (
        <Card key={variant} title={variant}>
          <Sample args={{ ...normalized(args), variant }} />
        </Card>
      ))}
    </div>
  ),
};
export const WithStatus: Story = {
  parameters: gallery(
    ["status"],
    "All presence states are fixed. Size, variant, identity and content remain editable."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[700px] grid-cols-5 gap-4">
        {statuses.map((status) => (
          <Card key={status || "none"} title={status || "None"}>
            <Sample args={{ ...normalized(args), status }} />
            <p className="m-0 text-xs capitalize text-semantic-text-muted">
              {status || "No presence indicator"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["src", "initials", "customContent"],
    "Generated initials, explicit initials, image and custom children are fixed. There are no interactive states in Avatar; the presence gallery is separate."
  ),
  render: (args) => (
    <div className="grid max-w-full grid-cols-2 gap-4">
      {[
        {
          title: "Generated initials",
          props: {
            src: "",
            initials: undefined,
            customContent: "none" as const,
          },
        },
        {
          title: "Explicit initials",
          props: { src: "", initials: "CS", customContent: "none" as const },
        },
        {
          title: "Image",
          props: { src: portrait, customContent: "none" as const },
        },
        {
          title: "Custom children",
          props: { src: "", customContent: "person" as const },
        },
      ].map(({ title, props }) => (
        <Card key={title} title={title}>
          <Sample args={{ ...normalized(args), ...props }} />
        </Card>
      ))}
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    ["variant", "size"],
    "Every shared size and Soft/Filled variant is paired between v1 and v2. Outline is additive v2 and shown in its own story. Identity, images and presence remain editable."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-5 gap-4">
        {(["soft", "filled"] as const).flatMap((variant) =>
          sizes.map((size) => (
            <Card key={variant + size} title={variant + " · " + size}>
              <div className="flex items-center gap-5">
                {(["v1", "v2"] as const).map((version) => (
                  <div
                    key={version}
                    className="flex flex-col items-center gap-3"
                  >
                    <p className="m-0 text-xs font-semibold text-semantic-text-muted">
                      {version}
                    </p>
                    <Sample
                      args={{ ...normalized(args), variant, size }}
                      version={version}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  ),
};
function ProfileExample({
  args,
  update,
}: {
  args: Args;
  update: (next: Partial<Args>) => void;
}) {
  const id = React.useId();
  return (
    <section className="max-w-[600px] rounded-lg border border-semantic-border-layout p-5">
      <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
        Profile preview
      </h3>
      <p className="m-0 mt-1 text-xs text-semantic-text-muted">
        Edit the name or presence. Both stay synchronized with Controls.
      </p>
      <div className="my-5 flex items-center gap-4">
        <Sample args={normalized(args)} />
        <div>
          <p className="m-0 text-sm font-medium text-semantic-text-primary">
            {args.name || "Unnamed profile"}
          </p>
          <p className="m-0 mt-1 text-xs capitalize text-semantic-text-muted">
            {args.status || "No status"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={id + "-name"}
            className="mb-2 block text-sm font-medium"
          >
            Name
          </label>
          <Input
            id={id + "-name"}
            value={args.name || ""}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor={id + "-status"}
            className="mb-2 block text-sm font-medium"
          >
            Presence
          </label>
          <Select
            value={args.status || "none"}
            onValueChange={(value) =>
              update({
                status:
                  value === "none" ? undefined : (value as Args["status"]),
              })
            }
          >
            <SelectTrigger id={id + "-status"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status || "none"} value={status || "none"}>
                  {status || "none"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
export const Usage: Story = {
  args: { status: "online" },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <ProfileExample args={args} update={update} />;
  },
};
export const CompositionExample: Story = {
  ...Usage,
  name: "Profile composition",
};
