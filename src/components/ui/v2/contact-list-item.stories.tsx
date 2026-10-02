import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import {
  ContactListItem,
  type ContactListItemProps,
} from "./contact-list-item";
import { ContactListItem as ContactV1 } from "../contact-list-item";
import { Input } from "./input";
import { gallery } from "../../../storybook/v2-preview";
import { v2ComponentDocs } from "./story-docs";

type Args = Omit<ContactListItemProps, "trailing" | "onClick"> & {
  onClick?: () => void;
  trailing: string;
  query: string;
};
const controls = [
  "name",
  "subtitle",
  "trailing",
  "avatarSrc",
  "isSelected",
  "onClick",
  "query",
];
function contactProps(args: Args) {
  const { query, onClick, ...props } = args;
  void [query];
  return { ...props, onClick: onClick ? () => onClick() : undefined };
}
const meta: Meta<Args> = {
  title: "V2/Components/ContactListItem",
  component: ContactListItem,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: { include: controls.filter((x) => x !== "query") },
    docs: {
      description: {
        component: v2ComponentDocs({
          name: "contact-list-item",
          summary:
            "A keyboard-accessible contact row with identity, secondary information and a trailing slot.",
          changes: [
            [
              "Typography",
              "Inherited Source Sans",
              "Inter; existing 14px name and 12px supporting text",
            ],
            ["Avatar", "Legacy avatar", "v2 Avatar, 30px small size"],
            [
              "Interaction",
              "Click, Enter and Space",
              "Same activation; selection examples synchronize Controls",
            ],
          ],
          tokens: [
            ["Primary text", "--semantic-text-primary", "#181D27", "#181D27"],
            ["Muted text", "--semantic-text-muted", "#717680", "#717680"],
            ["Selected surface", "--semantic-bg-ui", "#F5F5F5", "#F5F5F5"],
            ["Type", "--font-v2", "Name 14px/500; subtitle 12px"],
            ["Spacing", "gap / padding", "12px"],
          ],
          guidance:
            "Supply onClick to select a contact. This row does not own selection or filter data; the stories model those application choices locally. Trailing is a ReactNode slot; its text Control is an example.",
        }),
      },
    },
  },
  args: {
    name: "Aditi Kumar",
    subtitle: "aditi@example.com",
    trailing: "MY01",
    avatarSrc: "",
    isSelected: false,
    onClick: fn(),
    query: "",
  },
  argTypes: {
    name: { control: "text" },
    subtitle: { control: "text" },
    trailing: { control: "text", table: { category: "Example" } },
    avatarSrc: { control: "text" },
    isSelected: { control: "boolean" },
    onClick: { control: false },
    query: { control: "text", table: { category: "Example" } },
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
      <div className="max-w-lg rounded-lg border border-semantic-border-layout">
        <ContactListItem
          {...contactProps(args)}
          onClick={() => {
            args.onClick?.();
            update({ isSelected: !args.isSelected });
          }}
        />
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Selected: Story = { args: { isSelected: true } };
export const NameOnly: Story = { args: { subtitle: "", trailing: "" } };
export const LongName: Story = {
  args: {
    name: "Aditi Kumar — Customer Success and Account Operations",
    subtitle: "Customer success team",
    trailing: "MY03",
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
    ["subtitle", "trailing"],
    "Name-only, secondary-text and trailing-slot compositions are fixed. Identity and selection Controls apply to every row."
  ),
  render: (args) => (
    <div className="grid max-w-full gap-4 md:grid-cols-3">
      {[
        { title: "Name only", subtitle: "", trailing: "" },
        { title: "With subtitle", subtitle: "Customer success", trailing: "" },
        {
          title: "With trailing slot",
          subtitle: "Customer success",
          trailing: "MY03",
        },
      ].map(({ title, ...slots }) => (
        <Card key={title} title={title}>
          <ContactListItem {...contactProps(args)} {...slots} />
        </Card>
      ))}
    </div>
  ),
};
export const States: Story = {
  parameters: gallery(
    ["isSelected"],
    "Selected state is fixed; identity and slot Controls remain editable. Hover/focus styles are forced for comparison."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[820px] grid-cols-2 gap-4">
        {[
          { title: "Default", selected: false, cls: "" },
          { title: "Hovered", selected: false, cls: "pseudo-hover" },
          { title: "Selected", selected: true, cls: "" },
          {
            title: "Keyboard focus",
            selected: false,
            cls: "pseudo-focus-visible",
          },
        ].map((c) => (
          <Card title={c.title} key={c.title}>
            <ContactListItem
              {...contactProps(args)}
              isSelected={c.selected}
              className={c.cls}
            />
          </Card>
        ))}
      </div>
    </div>
  ),
};
export const V1VsV2: Story = {
  name: "v1 vs v2",
  parameters: gallery(
    [],
    "Both versions receive identical editable identity and selection props and retain their own Avatar implementation."
  ),
  render: (args) => (
    <div className="max-w-full overflow-x-auto">
      <div className="grid min-w-[760px] grid-cols-2 gap-4">
        <Card title="v1">
          <ContactV1 {...contactProps(args)} className="font-sans" />
        </Card>
        <Card title="v2">
          <ContactListItem {...contactProps(args)} />
        </Card>
      </div>
    </div>
  ),
};
const people = [
  { name: "Aditi Kumar", subtitle: "aditi@example.com", trailing: "MY01" },
  { name: "Mira Shah", subtitle: "mira@example.com", trailing: "MY02" },
  { name: "Noor Khan", subtitle: "noor@example.com", trailing: "MY03" },
];
function Directory({
  args,
  update,
}: {
  args: Args;
  update: (next: Partial<Args>) => void;
}) {
  const id = React.useId();
  const [selected, setSelected] = React.useState("Aditi Kumar");
  const filtered = people.filter((p) =>
    p.name.toLowerCase().includes(args.query.toLowerCase())
  );
  return (
    <section className="max-w-3xl rounded-lg border border-semantic-border-layout p-4">
      <h3 className="m-0 text-base font-medium text-[var(--v2-text-primary,#484848)]">
        Contact directory
      </h3>
      <p className="m-0 mt-1 mb-4 text-xs text-[var(--v2-text-muted,#707070)]">
        Search locally, then click a row or use Enter/Space to select it.
      </p>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[var(--v2-text-primary,#484848)]"
      >
        Search contacts
      </label>
      <Input
        id={id}
        value={args.query}
        placeholder="Search by name"
        onChange={(e) => update({ query: e.target.value })}
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-lg border border-semantic-border-layout">
          {filtered.map((p) => (
            <ContactListItem
              key={p.name}
              {...p}
              isSelected={p.name === selected}
              onClick={() => {
                args.onClick?.();
                setSelected(p.name);
              }}
            />
          ))}
          {!filtered.length && (
            <p className="m-0 p-4 text-sm text-[var(--v2-text-muted,#707070)]">
              No matching contacts
            </p>
          )}
        </div>
        <div className="rounded-lg bg-semantic-bg-ui p-4">
          <p className="m-0 text-xs text-[var(--v2-text-muted,#707070)]">
            Selected contact
          </p>
          <p className="m-0 mt-2 text-sm font-medium">{selected}</p>
        </div>
      </div>
    </section>
  );
}
export const Usage: Story = {
  parameters: { controls: { include: ["query", "onClick"] } },
  render: function Render(args) {
    const [, update] = useArgs<Args>();
    return <Directory args={args} update={update} />;
  },
};

export const Interaction: Story = {
  name: "Interaction test",
  tags: ["!autodocs"],
  args: {
    name: "Aditi Kumar",
    subtitle: "aditi@example.com",
    trailing: "MY01",
    avatarSrc: "",
    isSelected: false,
  },
  parameters: {
    // Every activation updates Controls, which re-renders the story; keep the spy history through that.
    test: { restoreMocks: false },
    docs: {
      description: {
        story:
          "Plays real clicks and Enter/Space activation against the action spy. Each activation toggles the selected surface through Controls and the play ends where it started, so it can be replayed. Open the Interactions panel to step through it.",
      },
    },
  },
  play: async ({ args, canvasElement, step }) => {
    clearAllMocks();
    const canvas = within(canvasElement);
    const row = canvas.getByRole("button", { name: /aditi@example\.com/ });
    const selectedSurface = "bg-semantic-bg-ui";

    await step("Renders one focusable row with the contact", async () => {
      await expect(row).toHaveAttribute("tabindex", "0");
      await expect(within(row).getByText("MY01")).toBeVisible();
      await expect(
        within(row).getByRole("img", { name: "Aditi Kumar" })
      ).toHaveTextContent("AK");
      await expect(row).not.toHaveClass(selectedSurface);
    });

    await step("Clicks select and clear the row", async () => {
      await userEvent.click(row);
      await waitFor(() => expect(row).toHaveClass(selectedSurface));
      await userEvent.click(row);
      await waitFor(() => expect(row).not.toHaveClass(selectedSurface));
      await expect(args.onClick).toHaveBeenCalledTimes(2);
    });

    await step("Enter and Space activate it; other keys do not", async () => {
      row.focus();
      await userEvent.keyboard("a{Escape}");
      await expect(args.onClick).toHaveBeenCalledTimes(2);
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(row).toHaveClass(selectedSurface));
      await userEvent.keyboard(" ");
      await waitFor(() => expect(row).not.toHaveClass(selectedSurface));
      await expect(args.onClick).toHaveBeenCalledTimes(4);
    });
  },
};
