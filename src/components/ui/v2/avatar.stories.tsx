import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { Phone, UserRound } from "lucide-react";
import { Avatar, AvatarGroup, type AvatarProps } from "./avatar";
import { Avatar as AvatarV1 } from "../avatar";
import { Input } from "./input";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = AvatarProps & {
  customContent: "none" | "person" | "phone";
  /** AvatarGroup only */
  max?: number;
};
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const variants = ["soft", "outline", "filled"] as const;
const statuses = [undefined, "online", "offline", "busy", "away"] as const;
const PEOPLE = [
  {
    name: "Emma Collins",
    src: "https://uiarc.dev/media/people/emma-collins.jpg",
  },
  {
    name: "Marcus Johnson",
    src: "https://uiarc.dev/media/people/marcus-johnson.jpg",
  },
  {
    name: "Ava Mitchell",
    src: "https://uiarc.dev/media/people/ava-mitchell.jpg",
  },
  { name: "Aditi Kumar", src: undefined },
  { name: "Ravi Shah", src: undefined },
  { name: "Meera Iyer", src: undefined },
];
const portrait = PEOPLE[0].src;
const missingPortrait = "/avatar-image-that-does-not-exist.png";
function Sample({
  args,
  version = "v2",
}: {
  args: Args;
  version?: "v1" | "v2";
}) {
  const { customContent, max: _max, ...props } = args;
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
            [
              "Soft surface",
              "Grey",
              "Semantic info surface with a hairline border",
            ],
            [
              "Sizes",
              "24 / 32 / 40 / 48 / 64px",
              "Same v1 footprints and md default",
            ],
            [
              "Type",
              "Semibold inherited font",
              "Medium Timeless Sans (Inter fallback)",
            ],
            ["Outline", "Custom styling", "Named outline variant"],
            [
              "Broken image",
              "Browser broken-image glyph",
              "Custom content or initials stay visible while loading and on failure; replacing src retries",
            ],
            [
              "AvatarGroup",
              "—",
              "Additive export: -6px overlap, 2px surface ring, max with a same-size +N tile and hidden-person descriptions",
            ],
            [
              "Accessible name",
              "Name only",
              "Name, alt or initials, plus presence; explicit ARIA labels still take precedence",
            ],
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
            ["Group ring", "--semantic-bg-primary", "#FFFFFF", "#FFFFFF"],
            ["+N tile", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Online", "--semantic-success-primary", "#17B26A", "#17B26A"],
            ["Busy", "--semantic-error-primary", "#F04438", "#F04438"],
            ["Away", "--semantic-warning-primary", "#FDB022", "#FDB022"],
          ],
          guidance:
            "Provide name for generated initials and the accessible label. A loaded src takes precedence over custom children and initials; those remain available while a photo loads or if it fails. Changing src starts a fresh image attempt, including a previously failed URL. The default accessible name preserves the v1 identity; presence is included in the accessible description. Explicit aria-label or aria-labelledby still takes precedence, and aria-hidden can mark a decorative avatar. AvatarGroup overlaps children by 6px; max collapses the rest into a +N tile with an accessible description of the hidden people. size reaches the count tile and children without their own size. Avatar and AvatarGroup remain identity displays; put them in a button or link when an action is needed. customContent is a story control, not an Avatar prop. Preview portraits use public Arc UI sample URLs.",
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
export const Overview: Story = {
  args: { name: "Emma Collins", src: portrait, status: "online" },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <TeamPreview args={args} update={update} />;
  },
};
export const ExtraSmall: Story = { args: { size: "xs" } };
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const Soft: Story = { args: { variant: "soft" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Filled: Story = { args: { variant: "filled" } };
export const WithImage: Story = {
  args: { name: "Emma Collins", src: portrait, alt: "Emma Collins" },
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
    <section className="flex min-w-0 flex-col items-center gap-4 rounded-lg border border-v2-semantic-border-layout p-5">
      <h3 className="m-0 text-sm font-medium text-v2-semantic-text-primary">
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
function TeamPreview({
  args,
  update,
}: {
  args: Args;
  update: (next: Partial<Args>) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const id = React.useId();

  return (
    <section className="w-full max-w-[560px] rounded-xl border border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-5 sm:p-6">
      <h3 className="m-0 text-sm font-medium text-v2-semantic-text-primary">
        Support team
      </h3>
      <p className="m-0 mt-1 text-xs text-v2-semantic-text-muted">
        People behind every conversation.
      </p>
      <div className="my-6 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:flex sm:flex-wrap">
        <Sample args={normalized(args)} />
        <div className="min-w-0 flex-1">
          <p className="m-0 text-sm font-medium text-v2-semantic-text-primary">
            {args.name || "Unnamed profile"}
          </p>
          <p className="m-0 mt-1 text-xs text-v2-semantic-text-muted">
            Team lead · {args.status || "No presence indicator"}
          </p>
        </div>
        <div className="col-span-2 w-full sm:w-32">
          <label
            htmlFor={id + "-presence"}
            className="mb-1.5 block text-xs text-v2-semantic-text-muted"
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
            <SelectTrigger id={id + "-presence"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status || "none"} value={status || "none"}>
                  {status || "None"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        role="group"
        aria-label="Profile photo"
        className="flex flex-wrap gap-2"
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="aria-pressed:bg-v2-semantic-bg-ui"
          aria-pressed={args.src === portrait}
          onClick={() =>
            update({
              name: PEOPLE[0].name,
              src: portrait,
              initials: "",
              alt: "",
              customContent: "none",
            })
          }
        >
          Photo
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="aria-pressed:bg-v2-semantic-bg-ui"
          aria-pressed={args.src === PEOPLE[1].src}
          onClick={() =>
            update({
              name: PEOPLE[1].name,
              src: PEOPLE[1].src,
              initials: "",
              alt: "",
              customContent: "none",
            })
          }
        >
          Replace photo
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="aria-pressed:bg-v2-semantic-bg-ui"
          aria-pressed={!args.src}
          onClick={() =>
            update({ src: "", initials: "", customContent: "none" })
          }
        >
          Initials
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="aria-pressed:bg-v2-semantic-bg-ui"
          aria-pressed={args.src === missingPortrait}
          onClick={() =>
            update({
              src: missingPortrait,
              initials: "",
              customContent: "none",
            })
          }
        >
          Missing photo
        </Button>
      </div>
      <div className="mt-6 border-t border-v2-semantic-border-layout pt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="m-0 text-xs text-v2-semantic-text-muted">
            {PEOPLE.length} team members
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            aria-controls={id + "-team"}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show fewer" : "Show all people"}
          </Button>
        </div>
        <AvatarGroup
          id={id + "-team"}
          aria-label="Support team members"
          max={expanded ? undefined : 3}
          size={args.size}
        >
          {PEOPLE.map((person) => (
            <Avatar
              key={person.name}
              name={person.name}
              src={person.src}
              variant={args.variant}
              title={person.name}
            />
          ))}
        </AvatarGroup>
      </div>
    </section>
  );
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
            <p className="m-0 text-xs text-v2-semantic-text-muted">
              {{ xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }[size]}px
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
            <p className="m-0 text-xs capitalize text-v2-semantic-text-muted">
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
    "Generated initials, explicit initials, image, custom children and a failing image URL are fixed. There are no interactive states in Avatar; the presence gallery is separate."
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
        {
          // A URL that 404s: the avatar falls back to initials instead of showing a broken image.
          title: "Image fails to load",
          props: {
            src: missingPortrait,
            customContent: "none" as const,
          },
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
                    <p className="m-0 text-xs font-normal text-v2-semantic-text-muted">
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
function GroupSample({ args, max }: { args: Args; max?: number }) {
  return (
    <AvatarGroup aria-label="Assigned to" size={args.size} max={max}>
      {PEOPLE.map((person) => (
        <Avatar
          key={person.name}
          name={person.name}
          variant={args.variant}
          src={person.src}
        />
      ))}
    </AvatarGroup>
  );
}
export const Group: Story = {
  args: { size: "md", max: 3 },
  argTypes: {
    max: {
      control: { type: "number", min: 0, max: 6, step: 1 },
      description:
        "Avatars shown before the +N tile. Applies to AvatarGroup only; leave empty to show all.",
      table: { category: "AvatarGroup" },
    },
  },
  parameters: {
    controls: { include: ["size", "variant", "max"] },
    docs: {
      description: {
        story:
          "AvatarGroup overlaps its avatars by 6px with a 2px surface ring. Past max, the rest collapse into a +N tile of the same size. Its accessible description names the hidden people.",
      },
    },
  },
  render: (args) => {
    const shown =
      args.max !== undefined && Number.isFinite(args.max)
        ? Math.min(PEOPLE.length, Math.max(0, Math.floor(args.max)))
        : PEOPLE.length;
    return (
      <div className="flex flex-col gap-6">
        <GroupSample args={args} max={args.max} />
        <p className="m-0 text-xs text-v2-semantic-text-muted">
          {shown === PEOPLE.length
            ? "All six avatars shown."
            : `${shown} shown, ${PEOPLE.length - shown} hidden in the +N tile.`}
        </p>
      </div>
    );
  },
};
export const GroupSizes: Story = {
  name: "Group sizes",
  parameters: {
    layout: "padded",
    // Identity, image and presence controls do not apply to the fixed sample people.
    controls: { include: ["variant"] },
    docs: {
      description: {
        story:
          "All five sizes with max 3. The +N tile always matches the avatars beside it. Variant stays editable.",
      },
    },
  },
  render: (args) => (
    <div className="grid max-w-full gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-5">
          <span className="w-8 text-xs text-v2-semantic-text-muted">
            {size}
          </span>
          <GroupSample args={{ ...args, size }} max={3} />
        </div>
      ))}
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
    <section className="max-w-[600px] rounded-lg border border-v2-semantic-border-layout p-5">
      <h3 className="m-0 text-sm font-medium text-v2-semantic-text-primary">
        Profile preview
      </h3>
      <p className="m-0 mt-1 text-xs text-v2-semantic-text-muted">
        Edit the name or presence. Both stay synchronized with Controls.
      </p>
      <div className="my-5 flex items-center gap-4">
        <Sample args={normalized(args)} />
        <div>
          <p className="m-0 text-sm font-medium text-v2-semantic-text-primary">
            {args.name || "Unnamed profile"}
          </p>
          <p className="m-0 mt-1 text-xs capitalize text-v2-semantic-text-muted">
            {args.status || "No status"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={id + "-name"}
            className="mb-2 block text-sm font-medium text-v2-semantic-text-primary"
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
            className="mb-2 block text-sm font-medium text-v2-semantic-text-primary"
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
