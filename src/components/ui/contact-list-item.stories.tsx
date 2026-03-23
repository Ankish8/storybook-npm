import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";
import { ContactListItem } from "./contact-list-item";

const meta: Meta<typeof ContactListItem> = {
  title: "Custom/Chat/ContactListItem",
  component: ContactListItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A contact list item displaying avatar with initials, name, subtitle, and optional trailing content. Used in contact directories, user lists, and search results.

### Installation

\`\`\`bash
npx myoperator-ui add contact-list-item
\`\`\`

### Import

\`\`\`tsx
import { ContactListItem } from "@/components/ui/contact-list-item"
\`\`\`

### Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Usage</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">text-semantic-text-primary</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px;">Name text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">text-semantic-text-muted</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Subtitle & trailing text</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">bg-semantic-bg-hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-hover</code></td>
      <td style="padding: 12px 16px;">Hover background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #EBEBEB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">bg-semantic-bg-ui</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Selected background</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

### Usage

\`\`\`tsx
<ContactListItem
  name="Aditi Kumar"
  subtitle="+91 98765 43210"
  trailing="MY01"
  onClick={() => console.log("selected")}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
  argTypes: {
    name: {
      control: "text",
      description: "Contact name — displayed as primary text and used for Avatar initials",
    },
    subtitle: {
      control: "text",
      description: "Secondary text below the name (e.g., phone number, email)",
    },
    trailing: {
      control: "text",
      description: "Content rendered at the right edge (e.g., channel badge)",
    },
    avatarSrc: {
      control: "text",
      description: "Avatar image source — shows image instead of initials when provided",
    },
    isSelected: {
      control: "boolean",
      description: "Whether this item is currently selected/active",
    },
    onClick: {
      action: "clicked",
      description: "Click handler",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 384, background: "white" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Individual Stories ── */

export const Default: Story = {
  args: {
    name: "Aditi Kumar",
    subtitle: "+91 98765 43210",
    trailing: "MY01",
  },
};

export const WithoutSubtitle: Story = {
  name: "Without Subtitle",
  args: {
    name: "Aditi Kumar",
    trailing: "MY01",
  },
};

export const WithoutTrailing: Story = {
  name: "Without Trailing",
  args: {
    name: "Aditi Kumar",
    subtitle: "+91 98765 43210",
  },
};

export const Selected: Story = {
  name: "Selected",
  args: {
    name: "Aditi Kumar",
    subtitle: "+91 98765 43210",
    trailing: "MY01",
    isSelected: true,
  },
};

export const WithImage: Story = {
  name: "With Image",
  args: {
    name: "Aditi Kumar",
    subtitle: "+91 98765 43210",
    trailing: "MY01",
    avatarSrc: "https://i.pravatar.cc/150?u=aditi",
  },
};

/* ── Composition Story: Contact Directory ── */

const contactData = [
  {
    id: "1",
    name: "Aditi Kumar",
    subtitle: "+91 98765 43210",
    trailing: "MY01",
  },
  {
    id: "2",
    name: "Arsh Raj",
    subtitle: "+91 91234 56789",
    trailing: "MY02",
  },
  {
    id: "3",
    name: "Nitin Rajput",
    subtitle: "+91 87654 32100",
    trailing: "MY01",
  },
  {
    id: "4",
    name: "Priya Nair",
    subtitle: "+91 99887 76655",
    trailing: "MY03",
  },
  {
    id: "5",
    name: "Rohit Gupta",
    subtitle: "+91 77665 54433",
    trailing: "MY02",
  },
  {
    id: "6",
    name: "Sushant Arya",
    subtitle: "+91 88776 65544",
    trailing: "MY01",
  },
];

function ContactDirectory() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div className="rounded-lg border border-semantic-border-layout overflow-hidden">
      {contactData.map((contact, index) => (
        <div
          key={contact.id}
          className={
            index < contactData.length - 1
              ? "border-b border-semantic-border-layout"
              : ""
          }
        >
          <ContactListItem
            name={contact.name}
            subtitle={contact.subtitle}
            trailing={contact.trailing}
            isSelected={selectedId === contact.id}
            onClick={() => setSelectedId(contact.id)}
          />
        </div>
      ))}
    </div>
  );
}

export const ContactDirectoryStory: Story = {
  name: "Contact Directory",
  decorators: [
    (Story) => (
      <div style={{ width: 448, background: "white" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <ContactDirectory />,
};
