# Storybook Reference

Detailed patterns for Phase 5 of `SKILL.md`. The canonical reference is `src/components/custom/chat-list-item/chat-list-item.stories.tsx` — read it before writing any story.

## Step 0: Read a Reference Story First

Before writing a story file, always read the closest matching existing story:

```bash
# Custom Chat component
cat src/components/custom/chat-list-item/chat-list-item.stories.tsx

# Modal / overlay
cat src/components/ui/form-modal.stories.tsx

# UI primitive
cat src/components/ui/button.stories.tsx
```

Replicate its exact structure — never invent a new format.

---

## File Structure

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { ComponentName } from "./component-name"

const meta: Meta<typeof ComponentName> = {
  title: "Custom/Group/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
One-line description of what this component does.

### Installation

\`\`\`bash
npx myoperator-ui add component-name
\`\`\`

### Import

\`\`\`tsx
import { ComponentName } from "@/components/custom/component-name"
\`\`\`

### Design Tokens

| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Name text | \`--text/text-primary\` | Contact name | <span style="color:#181d27">■</span> \`#181D27\` |
| Muted text | \`--text/text-muted\` | Preview text | <span style="color:#717680">■</span> \`#717680\` |
| Border | \`--border/border-layout\` | Separator | <span style="color:#e9eaeb">■</span> \`#E9EAEB\` |
        `,
      },
    },
  },
  tags: ["autodocs"],
  // decorators only if component needs a fixed container:
  decorators: [
    (Story) => (
      <div style={{ width: 400, background: "white" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    // Every prop documented — see argTypes section below
  },
}

export default meta
type Story = StoryObj<typeof meta>
```

---

## docs.description.component — CRITICAL

This is a **template string** (backtick), NOT JSDoc (`/** */`). It sits inside `parameters.docs.description.component`.

Always include in this order:
1. One-line component description
2. `### Installation` — bash codeblock with `npx myoperator-ui add <name>`
3. `### Import` — tsx codeblock with the import statement
4. `### Design Tokens` — markdown table (NOT HTML table)

---

## Design Tokens Table Format

Use a **markdown table** inside the template string. Preview column uses inline `<span>` color swatch:

```markdown
| Token | CSS Variable | Usage | Preview |
|-------|-------------|-------|---------|
| Name text | `--text/text-primary` | Contact name | <span style="color:#181d27">■</span> `#181D27` |
| Message text | `--text/text-muted` | Message preview | <span style="color:#717680">■</span> `#717680` |
| Timestamp | — | Time display | <span style="color:#a2a6b1">■</span> `#A2A6B1` |
| Unread badge | `--secondary/200` | Unread count bg | <span style="color:#9de0e7">■</span> `#9DE0E7` |
| Border | `--border/border-layout` | Item separator | <span style="color:#e9eaeb">■</span> `#E9EAEB` |
```

Preview format: `<span style="color:#hex">■</span> \`#HEX\``

---

## argTypes — Every Prop Required

Every prop on the component interface must appear in `argTypes`:

| Prop kind | control value | Example |
|-----------|--------------|---------|
| `string` | `"text"` | `{ control: "text", description: "..." }` |
| `boolean` | `"boolean"` | `{ control: "boolean" }` |
| `number` | `"number"` | `{ control: "number" }` |
| `enum / union` | `"select"` | `{ control: "select", options: ["sent", "delivered", "read"] }` |
| `array / object` | `"object"` | `{ control: "object" }` |
| `ReactNode` / complex | `false` | `{ control: false }` |
| callback `() => void` | _(no control)_ | `{ action: "clicked", description: "..." }` |

Always add `table.defaultValue` and `table.type`:

```tsx
argTypes: {
  name: {
    control: "text",
    description: "Contact or customer name",
    table: {
      type: { summary: "string" },
    },
  },
  messageStatus: {
    control: "select",
    options: ["sent", "delivered", "read"],
    description: "Delivery status of the last outbound message",
    table: {
      type: { summary: "\"sent\" | \"delivered\" | \"read\"" },
    },
  },
  unreadCount: {
    control: "number",
    description: "Number of unread messages. Only shown when messageStatus is not set.",
    table: {
      type: { summary: "number" },
    },
  },
  onClick: {
    action: "clicked",
    description: "Called when the item is clicked",
    table: {
      type: { summary: "() => void" },
    },
  },
},
```

---

## Stories — One Per Visual State

Use `name:` to override the sidebar display name. Use `args:` with realistic values (not placeholder "test" strings):

```tsx
export const Default: Story = {
  args: {
    name: "Aditi Kumar",
    message: "Have a look at this document",
    timestamp: "2:30 PM",
    channel: "MY01",
    agentName: "Alex Smith",
  },
}

export const WithUnreadCount: Story = {
  name: "Unread Messages",
  args: {
    name: "Sushant Arya",
    message: "I am super excited!",
    timestamp: "Saturday",
    unreadCount: 3,
    channel: "MY01",
  },
}
```

---

## Modal Components — Trigger Button Pattern

**Never use `open: true` in modal story args.** The component must be closed by default, opened via a trigger Button:

```tsx
import { useState } from "react"
import { Button } from "../../ui/button"

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open ComponentName
        </Button>
        <ComponentName
          open={open}
          onOpenChange={setOpen}
          // all required props with realistic values
        />
      </div>
    )
  },
}

export const Loading: Story = {
  name: "Loading State",
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open (Loading)
        </Button>
        <ComponentName
          open={open}
          onOpenChange={setOpen}
          loading={true}
          // required props
        />
      </div>
    )
  },
}
```

Every story for a modal — Default, Loading, error states, variants — must use this `render()` + `useState` + trigger pattern.

---

## Inline / Page Components

Use `args:` directly. Add decorator if component needs a fixed-width container:

```tsx
decorators: [
  (Story) => (
    <div style={{ width: 356, background: "white" }}>
      <Story />
    </div>
  ),
],
```

---

## Checklist Before Saving

```
- [ ] docs.description.component is a template string (backtick, not /** */)
- [ ] ### Installation present with bash codeblock
- [ ] ### Import present with tsx codeblock
- [ ] ### Design Tokens present as markdown table (NOT HTML table)
- [ ] Token preview uses <span style="color:#hex">■</span> `#HEX` format
- [ ] argTypes covers EVERY prop in the interface
- [ ] Callbacks use action: not control:
- [ ] One story per visual state
- [ ] Stories use name: for readable sidebar display names
- [ ] Stories use realistic values (not "test", "foo", "bar")
- [ ] MODAL: all stories use render() + useState + trigger Button
- [ ] INLINE: args used directly, decorator added if fixed width needed
- [ ] Reference story was read before writing (see Step 0)
```
