import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Info, HelpCircle, Settings, Plus, Trash2 } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from './tooltip'
import { Button } from './button'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Installation

\`\`\`bash
npx myoperator-ui add tooltip
\`\`\`

## Import

\`\`\`tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from "@myoperator/ui"
\`\`\`

---

## Usage

Wrap your app or a section with \`TooltipProvider\` to enable tooltips:

\`\`\`tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
\`\`\`

---

## Props

### TooltipProvider
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| delayDuration | number | 700 | Delay before tooltip opens |
| skipDelayDuration | number | 300 | Time to skip delay when moving between tooltips |
| disableHoverableContent | boolean | false | Disable hovering over tooltip content |

### TooltipContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| side | "top" \\| "right" \\| "bottom" \\| "left" | "top" | Positioning side |
| sideOffset | number | 4 | Distance from trigger |
| align | "start" \\| "center" \\| "end" | "center" | Alignment along side |

---

## Accessibility

- Tooltips are shown on hover and keyboard focus
- Tooltips can be dismissed with the Escape key
- The trigger element receives \`aria-describedby\` pointing to the tooltip

---

## Design Tokens

| Token | Value |
|-------|-------|
| Background | \`#343E55\` |
| Text | \`white\` |
| Border Radius | \`rounded-md\` (6px) |
| Padding | \`py-1.5 px-3\` (6px 12px) |
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={100}>
        <Story />
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">With Arrow</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This tooltip has an arrow</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  ),
}

export const Positions: Story = {
  name: 'All Positions',
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top (default)</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>

      <div className="flex gap-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Tooltip on left</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Tooltip on right</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const Alignment: Story = {
  name: 'Alignment Options',
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Align Start</Button>
        </TooltipTrigger>
        <TooltipContent align="start">
          <p>Aligned to start</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Align Center</Button>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>Aligned to center</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Align End</Button>
        </TooltipTrigger>
        <TooltipContent align="end">
          <p>Aligned to end</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const WithOffset: Story = {
  name: 'Custom Offset',
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Default (4px)</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>
          <p>4px offset</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">10px Offset</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          <p>10px offset</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">20px Offset</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={20}>
          <p>20px offset</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const WithIcons: Story = {
  name: 'Icon Triggers',
  render: () => (
    <div className="flex gap-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full w-8 h-8 hover:bg-gray-100">
            <Info className="h-4 w-4 text-gray-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>More information</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full w-8 h-8 hover:bg-gray-100">
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Need help?</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full w-8 h-8 hover:bg-gray-100">
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const IconButtons: Story = {
  name: 'Use Case: Icon Buttons',
  render: () => (
    <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add new item</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open settings</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete item</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tooltips are essential for icon-only buttons to provide context for users.',
      },
    },
  },
}

export const LongContent: Story = {
  name: 'Long Content',
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for details</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>
          This is a tooltip with longer content. It can contain multiple
          sentences to provide more detailed information about the element.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const RichContent: Story = {
  name: 'Rich Content',
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Rich Tooltip</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Keyboard Shortcut</p>
          <p className="text-gray-300">Press Ctrl + S to save your work</p>
        </div>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  ),
}

const ControlledExample = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button variant="outline">Controlled Tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>I'm controlled!</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          Show
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
          Hide
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        State: {open ? 'Open' : 'Closed'}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story: 'Use the `open` and `onOpenChange` props to control the tooltip state programmatically.',
      },
    },
  },
}

export const DisabledButton: Story = {
  name: 'Use Case: Disabled Button',
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-block">
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>You don't have permission to perform this action</p>
      </TooltipContent>
    </Tooltip>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Wrap disabled buttons in a span to enable tooltip functionality, since disabled elements don\'t trigger mouse events.',
      },
    },
  },
}

export const TextTrigger: Story = {
  name: 'Text Trigger',
  render: () => (
    <p className="text-sm">
      This is some text with a{' '}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-help">
            technical term
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>A brief explanation of the term</p>
        </TooltipContent>
      </Tooltip>{' '}
      that needs explanation.
    </p>
  ),
}

export const TruncatedText: Story = {
  name: 'Use Case: Truncated Text',
  render: () => (
    <div className="w-48">
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="truncate cursor-default">
            This is a very long text that will be truncated in the UI
          </p>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a very long text that will be truncated in the UI</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Show full content in tooltip when text is truncated.',
      },
    },
  },
}
