import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './typography'

const meta: Meta<typeof Typography> = {
  title: 'Foundations/Typography Component',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A semantic typography component for consistent text styling across your application.

\`\`\`bash
npx myoperator-ui add typography
\`\`\`

## Import

\`\`\`tsx
import { Typography } from "@/components/ui/typography"
\`\`\`

## Features

- **Semantic HTML**: Automatically uses appropriate tags (h1-h6, label, span) based on kind
- **5 Kinds**: display, headline, title, label, body
- **3 Variants**: large, medium, small
- **8 Colors**: primary, secondary, muted, placeholder, link, inverted, error, success
- **Text Alignment**: left, center, right
- **Truncation**: Built-in ellipsis overflow support
- **Custom Tags**: Override default semantic tags when needed
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The text content to display',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '-' },
        category: 'Content',
      },
    },
    kind: {
      control: 'radio',
      options: ['display', 'headline', 'title', 'label', 'body'],
      description: 'Typography kind - determines base styling and semantic HTML tag',
      table: {
        type: { summary: '"display" | "headline" | "title" | "label" | "body"' },
        defaultValue: { summary: '"body"' },
        category: 'Typography',
      },
    },
    variant: {
      control: 'radio',
      options: ['large', 'medium', 'small'],
      description: 'Size variant within the selected kind',
      table: {
        type: { summary: '"large" | "medium" | "small"' },
        defaultValue: { summary: '"medium"' },
        category: 'Typography',
      },
    },
    color: {
      control: 'select',
      options: ['(none)', 'primary', 'secondary', 'muted', 'placeholder', 'link', 'inverted', 'error', 'success'],
      mapping: {
        '(none)': undefined,
        primary: 'primary',
        secondary: 'secondary',
        muted: 'muted',
        placeholder: 'placeholder',
        link: 'link',
        inverted: 'inverted',
        error: 'error',
        success: 'success',
      },
      description: 'Text color variant',
      table: {
        type: { summary: '"primary" | "secondary" | "muted" | "placeholder" | "link" | "inverted" | "error" | "success"' },
        defaultValue: { summary: 'undefined' },
        category: 'Appearance',
      },
    },
    align: {
      control: 'radio',
      options: ['(none)', 'left', 'center', 'right'],
      mapping: {
        '(none)': undefined,
        left: 'left',
        center: 'center',
        right: 'right',
      },
      description: 'Text alignment',
      table: {
        type: { summary: '"left" | "center" | "right"' },
        defaultValue: { summary: 'undefined' },
        category: 'Appearance',
      },
    },
    truncate: {
      control: 'boolean',
      description: 'Enable text truncation with ellipsis (requires block display)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance',
      },
    },
    tag: {
      control: 'select',
      options: ['(auto)', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'strong', 'em'],
      mapping: {
        '(auto)': undefined,
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        p: 'p',
        span: 'span',
        div: 'div',
        label: 'label',
        strong: 'strong',
        em: 'em',
      },
      description: 'Override the automatically selected HTML tag',
      table: {
        type: { summary: 'keyof JSX.IntrinsicElements' },
        defaultValue: { summary: 'auto (based on kind)' },
        category: 'Advanced',
      },
    },
    htmlFor: {
      control: 'text',
      description: 'Associates label with a form element (only works with label tag)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Advanced',
      },
      if: { arg: 'kind', eq: 'label' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Advanced',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// OVERVIEW - Main interactive story
// =============================================================================

export const Overview: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    kind: 'headline',
    variant: 'medium',
    color: undefined,
    align: undefined,
    truncate: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to explore all Typography props. Try changing the controls below.',
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Show inverted color on dark background
      if (context.args.color === 'inverted') {
        return (
          <div className="bg-[#343E55] p-6 rounded-lg">
            <Story />
          </div>
        )
      }
      return <Story />
    },
  ],
}

// =============================================================================
// ALL KINDS - Hidden from sidebar, visible in docs
// =============================================================================

export const AllKinds: Story = {
  name: 'All Kinds',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">Display</Typography>
        <Typography kind="display" variant="medium">Display Text</Typography>
      </div>
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">Headline</Typography>
        <Typography kind="headline" variant="medium">Headline Text</Typography>
      </div>
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">Title</Typography>
        <Typography kind="title" variant="medium">Title Text</Typography>
      </div>
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">Label</Typography>
        <Typography kind="label" variant="medium">Label Text</Typography>
      </div>
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">Body</Typography>
        <Typography kind="body" variant="medium">Body Text</Typography>
      </div>
    </div>
  ),
}

// =============================================================================
// ALL VARIANTS
// =============================================================================

export const AllVariants: Story = {
  name: 'All Variants',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <Typography kind="title" variant="small" color="muted" className="mb-4">Headlines</Typography>
        <div className="flex flex-col gap-2">
          <Typography kind="headline" variant="large">Headline Large (32px)</Typography>
          <Typography kind="headline" variant="medium">Headline Medium (28px)</Typography>
          <Typography kind="headline" variant="small">Headline Small (24px)</Typography>
        </div>
      </div>
      <div>
        <Typography kind="title" variant="small" color="muted" className="mb-4">Titles</Typography>
        <div className="flex flex-col gap-2">
          <Typography kind="title" variant="large">Title Large (18px)</Typography>
          <Typography kind="title" variant="medium">Title Medium (16px)</Typography>
          <Typography kind="title" variant="small">Title Small (14px)</Typography>
        </div>
      </div>
      <div>
        <Typography kind="title" variant="small" color="muted" className="mb-4">Body</Typography>
        <div className="flex flex-col gap-2">
          <Typography kind="body" variant="large">Body Large (16px)</Typography>
          <Typography kind="body" variant="medium">Body Medium (14px)</Typography>
          <Typography kind="body" variant="small">Body Small (12px)</Typography>
        </div>
      </div>
      <div>
        <Typography kind="title" variant="small" color="muted" className="mb-4">Labels</Typography>
        <div className="flex flex-col gap-2">
          <Typography kind="label" variant="large">Label Large (14px)</Typography>
          <Typography kind="label" variant="medium">Label Medium (12px)</Typography>
          <Typography kind="label" variant="small">Label Small (10px)</Typography>
        </div>
      </div>
    </div>
  ),
}

// =============================================================================
// COLORS
// =============================================================================

export const Colors: Story = {
  name: 'Colors',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-24">
          <Typography kind="label" variant="small" color="muted">Primary</Typography>
        </div>
        <Typography color="primary">Primary text for main content (#181D27)</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24">
          <Typography kind="label" variant="small" color="muted">Secondary</Typography>
        </div>
        <Typography color="secondary">Secondary text for supporting content (#343E55)</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24">
          <Typography kind="label" variant="small" color="muted">Muted</Typography>
        </div>
        <Typography color="muted">Muted text for captions and helper text (#717680)</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24">
          <Typography kind="label" variant="small" color="muted">Placeholder</Typography>
        </div>
        <Typography color="placeholder">Placeholder text for inputs (#A2A6B1)</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24">
          <Typography kind="label" variant="small" color="muted">Link</Typography>
        </div>
        <Typography color="link">Link text for clickable elements (#4275D6)</Typography>
      </div>
      <div className="flex items-center gap-4 bg-[#343E55] p-3 rounded">
        <div className="w-24">
          <Typography kind="label" variant="small" color="inverted">Inverted</Typography>
        </div>
        <Typography color="inverted">Inverted text on dark backgrounds (#FFFFFF)</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24">
          <Typography kind="label" variant="small" color="muted">Error</Typography>
        </div>
        <Typography color="error">Error text for validation messages (#F04438)</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24">
          <Typography kind="label" variant="small" color="muted">Success</Typography>
        </div>
        <Typography color="success">Success text for confirmation messages (#17B26A)</Typography>
      </div>
    </div>
  ),
}

// =============================================================================
// ALIGNMENT
// =============================================================================

export const Alignment: Story = {
  name: 'Alignment',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <div className="border border-dashed border-gray-300 p-4 rounded">
        <Typography align="left">Left aligned text (default)</Typography>
      </div>
      <div className="border border-dashed border-gray-300 p-4 rounded">
        <Typography align="center">Center aligned text</Typography>
      </div>
      <div className="border border-dashed border-gray-300 p-4 rounded">
        <Typography align="right">Right aligned text</Typography>
      </div>
    </div>
  ),
}

// =============================================================================
// TRUNCATE
// =============================================================================

export const Truncate: Story = {
  name: 'Truncate',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">Without truncate</Typography>
        <Typography>
          This is a very long text that will wrap to multiple lines when it exceeds the container width.
        </Typography>
      </div>
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">With truncate</Typography>
        <Typography truncate className="block">
          This is a very long text that will be truncated with an ellipsis when it exceeds the container width.
        </Typography>
      </div>
    </div>
  ),
}

// =============================================================================
// SEMANTIC TAGS
// =============================================================================

export const SemanticTags: Story = {
  name: 'Semantic Tags',
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        story: 'Typography automatically uses semantic HTML tags based on the kind and variant.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 py-2 border-b border-gray-200">
        <div className="w-40">
          <Typography kind="label" variant="small" color="muted">Kind-Variant</Typography>
        </div>
        <div className="w-20">
          <Typography kind="label" variant="small" color="muted">Tag</Typography>
        </div>
        <Typography kind="label" variant="small" color="muted">Example</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">headline-large</code></div>
        <div className="w-20"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">h1</code></div>
        <Typography kind="headline" variant="large">Page Title</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">headline-medium</code></div>
        <div className="w-20"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">h2</code></div>
        <Typography kind="headline" variant="medium">Section</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">headline-small</code></div>
        <div className="w-20"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">h3</code></div>
        <Typography kind="headline" variant="small">Subsection</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">title-*</code></div>
        <div className="w-20"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">h5</code></div>
        <Typography kind="title" variant="medium">Card Title</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">label-*</code></div>
        <div className="w-20"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">label</code></div>
        <Typography kind="label" variant="medium">Form Label</Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-40"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">body-*</code></div>
        <div className="w-20"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">span</code></div>
        <Typography kind="body" variant="medium">Body text</Typography>
      </div>
    </div>
  ),
}

// =============================================================================
// CUSTOM TAGS
// =============================================================================

export const CustomTags: Story = {
  name: 'Custom Tags',
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        story: 'Override the default semantic tag using the `tag` prop.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">
          Body as paragraph
        </Typography>
        <Typography tag="p">
          This body text renders as a paragraph element instead of a span.
        </Typography>
      </div>
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">
          Title as div
        </Typography>
        <Typography kind="title" variant="medium" tag="div">
          This title renders as a div element instead of h5.
        </Typography>
      </div>
      <div>
        <Typography kind="label" variant="small" color="muted" className="mb-1">
          Body as strong
        </Typography>
        <Typography tag="strong">
          This body text renders as a strong element for emphasis.
        </Typography>
      </div>
    </div>
  ),
}

// =============================================================================
// REAL WORLD EXAMPLES
// =============================================================================

export const RealWorldExamples: Story = {
  name: 'Real World Examples',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* Page Header Example */}
      <div className="border border-gray-200 rounded-lg p-6">
        <Typography kind="label" variant="small" color="muted" className="mb-4">Page Header</Typography>
        <Typography kind="headline" variant="large" className="mb-2">Dashboard</Typography>
        <Typography kind="body" color="muted">
          Welcome back! Here's what's happening with your projects.
        </Typography>
      </div>

      {/* Card Example */}
      <div className="border border-gray-200 rounded-lg p-6">
        <Typography kind="label" variant="small" color="muted" className="mb-4">Card</Typography>
        <div className="border border-gray-200 rounded-lg p-4">
          <Typography kind="title" variant="medium" className="mb-2">Project Overview</Typography>
          <Typography kind="body" variant="small" color="muted">
            Track your project progress and collaborate with your team.
          </Typography>
        </div>
      </div>

      {/* Form Example */}
      <div className="border border-gray-200 rounded-lg p-6">
        <Typography kind="label" variant="small" color="muted" className="mb-4">Form</Typography>
        <div className="flex flex-col gap-3">
          <div>
            <Typography kind="label" variant="medium" htmlFor="email" className="mb-1 block">
              Email Address
            </Typography>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Enter your email"
            />
            <Typography kind="body" variant="small" color="muted" className="mt-1">
              We'll never share your email with anyone.
            </Typography>
          </div>
        </div>
      </div>

      {/* Error Message Example */}
      <div className="border border-gray-200 rounded-lg p-6">
        <Typography kind="label" variant="small" color="muted" className="mb-4">Error Message</Typography>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Typography kind="title" variant="small" color="error" className="mb-1">
            Error occurred
          </Typography>
          <Typography kind="body" variant="small" color="error">
            Failed to save changes. Please try again.
          </Typography>
        </div>
      </div>

      {/* Success Message Example */}
      <div className="border border-gray-200 rounded-lg p-6">
        <Typography kind="label" variant="small" color="muted" className="mb-4">Success Message</Typography>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <Typography kind="title" variant="small" color="success" className="mb-1">
            Changes saved
          </Typography>
          <Typography kind="body" variant="small" color="success">
            Your settings have been updated successfully.
          </Typography>
        </div>
      </div>
    </div>
  ),
}

// =============================================================================
// DISPLAY SHOWCASE
// =============================================================================

export const DisplayShowcase: Story = {
  name: 'Display Showcase',
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography kind="display" variant="large">Display Large</Typography>
      <Typography kind="display" variant="medium">Display Medium</Typography>
      <Typography kind="display" variant="small">Display Small</Typography>
    </div>
  ),
}
