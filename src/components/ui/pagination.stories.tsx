import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationWidget,
} from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  subcomponents: {
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as Record<string, any>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Pagination with page navigation, next and previous links. A composable, headless pagination component that follows the shadcn/ui pattern.

\`\`\`bash
npx myoperator-ui add pagination
\`\`\`

## Import

\`\`\`tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
\`\`\`

## Usage

\`\`\`tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
\`\`\`

## Design Tokens

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
      <td style="padding: 12px 16px;">Active Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px;">Active page link border (outline variant)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Active Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-primary</code></td>
      <td style="padding: 12px 16px;">Active page link background (outline variant)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #FFFFFF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Hover Background</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-bg-ui</code></td>
      <td style="padding: 12px 16px;">Inactive link hover (ghost variant)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #F5F5F5; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Text Color</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px;">Inactive page link text (ghost variant)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Active Hover</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary-surface</code></td>
      <td style="padding: 12px 16px;">Active page link hover (outline variant)</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #EFF6FF; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Focus Ring</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px;">Focus ring color on pagination links</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Style</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Page Number</td>
      <td style="padding: 12px 16px;">Label/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Medium</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-medium</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Previous / Next Label</td>
      <td style="padding: 12px 16px;">Label/Large</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Medium</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-medium</code></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Ellipsis Icon</td>
      <td style="padding: 12px 16px;">Icon</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">16px (size-4)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">size-4</code></td>
    </tr>
  </tbody>
</table>

## Props

### PaginationLink

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`isActive\` | \`boolean\` | \`false\` | Highlights the link as the current page |
| \`size\` | \`"default" \\| "sm" \\| "lg" \\| "icon"\` | \`"icon"\` | Size of the link (uses Button size variants) |
| \`href\` | \`string\` | — | URL for the page link |
| \`className\` | \`string\` | — | Additional CSS classes |

### PaginationPrevious / PaginationNext

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`href\` | \`string\` | — | URL for previous/next page |
| \`className\` | \`string\` | — | Additional CSS classes |

### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`className\` | \`string\` | — | Additional CSS classes for the nav wrapper |
| \`aria-label\` | \`string\` | \`"pagination"\` | Accessible label for the nav element |

## Sub-components

| Component | Element | Purpose |
|-----------|---------|---------|
| \`Pagination\` | \`<nav>\` | Root wrapper with navigation role |
| \`PaginationContent\` | \`<ul>\` | Flex container for items |
| \`PaginationItem\` | \`<li>\` | Wrapper for each pagination element |
| \`PaginationLink\` | \`<a>\` | Clickable page link with \`isActive\` prop |
| \`PaginationPrevious\` | \`<a>\` | Previous page link with chevron icon |
| \`PaginationNext\` | \`<a>\` | Next page link with chevron icon |
| \`PaginationEllipsis\` | \`<span>\` | Ellipsis indicator for skipped pages |
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes for the nav wrapper",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const WithMorePages: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const FirstPageActive: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const LastPageActive: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">8</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">9</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            10
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const IconsOnly: Story = {
  name: "Icons Only (No Page Numbers)",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const FewPages: Story = {
  name: "Few Pages (No Ellipsis)",
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const Usage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Guidelines for composing the Pagination component.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h4 className="font-medium text-sm mb-3">PaginationLink — Active vs Inactive</h4>
        <p className="text-sm text-gray-600 mb-3">
          Use <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">isActive</code> to
          indicate the current page. Active links use the <strong>outline</strong> button variant,
          inactive links use <strong>ghost</strong>.
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">PaginationPrevious / PaginationNext</h4>
        <p className="text-sm text-gray-600 mb-3">
          Navigation links with chevron icons. Labels are hidden on small screens (<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">hidden sm:block</code>), showing only the icon on mobile.
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">PaginationEllipsis</h4>
        <p className="text-sm text-gray-600 mb-3">
          Use to indicate skipped page ranges. Renders a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">MoreHorizontalIcon</code> with
          sr-only "More pages" text for screen readers.
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
};

const meta2: Meta<typeof PaginationWidget> = {
  title: "Components/PaginationWidget",
  component: PaginationWidget,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A convenience wrapper around the Pagination primitives. Handles page range computation, ellipsis logic, and prev/next disabled states automatically.

\`\`\`bash
npx myoperator-ui add pagination
\`\`\`

## Import

\`\`\`tsx
import { PaginationWidget } from "@/components/ui/pagination"
\`\`\`

## Usage

\`\`\`tsx
const [page, setPage] = React.useState(1);
<PaginationWidget
  currentPage={page}
  totalPages={20}
  onPageChange={setPage}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    siblingCount: { control: { type: "number", min: 0 } },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _meta2 = meta2;

function WidgetDemo(props: React.ComponentProps<typeof PaginationWidget>) {
  const [page, setPage] = React.useState(props.currentPage);
  return (
    <PaginationWidget
      {...props}
      currentPage={page}
      onPageChange={setPage}
    />
  );
}

export const Widget: Story = {
  name: "PaginationWidget — Interactive",
  parameters: {
    docs: {
      description: {
        story:
          "A self-contained pagination widget that computes visible pages, ellipses, and disabled states. Use the controls to explore different total pages and sibling counts.",
      },
    },
  },
  render: (args) => <WidgetDemo {...args} currentPage={5} totalPages={20} siblingCount={1} />,
};

export const WidgetFirstPage: Story = {
  name: "PaginationWidget — First Page (Prev disabled)",
  parameters: {
    docs: {
      description: {
        story: "When on page 1, the Previous button is disabled.",
      },
    },
  },
  render: () => (
    <WidgetDemo currentPage={1} totalPages={10} onPageChange={() => {}} />
  ),
};

export const WidgetLastPage: Story = {
  name: "PaginationWidget — Last Page (Next disabled)",
  parameters: {
    docs: {
      description: {
        story: "When on the last page, the Next button is disabled.",
      },
    },
  },
  render: () => (
    <WidgetDemo currentPage={10} totalPages={10} onPageChange={() => {}} />
  ),
};

export const WidgetFewPages: Story = {
  name: "PaginationWidget — Few Pages (No ellipsis)",
  render: () => (
    <WidgetDemo currentPage={3} totalPages={5} onPageChange={() => {}} />
  ),
};

export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pagination is accessible by default. Follow these guidelines for best practices.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h4 className="font-medium text-sm mb-3">Semantic structure</h4>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <p>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              Pagination
            </code>{" "}
            renders a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;nav&gt;</code> with{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">role="navigation"</code> and{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-label="pagination"</code>
          </p>
          <p>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              PaginationLink
            </code>{" "}
            uses <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-current="page"</code> when{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">isActive</code> is true
          </p>
          <p>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              PaginationEllipsis
            </code>{" "}
            is <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-hidden</code> with sr-only "More pages" text
          </p>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">Keyboard navigation</h4>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <p>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              Tab
            </code>{" "}
            to move focus between pagination links
          </p>
          <p>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              Enter
            </code>{" "}
            to activate the focused link
          </p>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">Focus indicators</h4>
        <p className="text-sm text-gray-600 mb-3">
          All pagination links inherit Button focus styles. Tab to see the focus ring:
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h4 className="font-medium text-sm mb-3">ARIA labels on navigation</h4>
        <p className="text-sm text-gray-600 mb-3">
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">PaginationPrevious</code> has{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-label="Go to previous page"</code> and{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">PaginationNext</code> has{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">aria-label="Go to next page"</code>.
        </p>
      </div>
    </div>
  ),
};
