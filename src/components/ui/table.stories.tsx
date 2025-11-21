import type { Meta, StoryObj } from '@storybook/react'
import { MoreVertical } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from './table'
import { Badge } from './badge'
import { Tag } from './tag'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Table component for displaying tabular data. Composable with nested components for maximum flexibility.

## Import

\`\`\`tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
\`\`\`

## Composition

The Table component is built from multiple sub-components:

- \`Table\` - Main table wrapper
- \`TableHeader\` - Table header section
- \`TableBody\` - Table body section
- \`TableFooter\` - Table footer section
- \`TableRow\` - Individual row
- \`TableHead\` - Header cell
- \`TableCell\` - Body cell
- \`TableCaption\` - Table caption

## Design Tokens

| Token | Value |
|-------|-------|
| Header Background | \`#F9FAFB\` |
| Border Color | \`#E5E7EB\` |
| Header Text | \`#6B7280\` |
| Cell Text | \`#333333\` |
| Cell Padding | \`16px\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>
            <Badge variant="active">Active</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>
            <Badge variant="disabled">Disabled</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WebhookTable: Story = {
  name: 'Webhook Table',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Url</TableHead>
          <TableHead>Events</TableHead>
          <TableHead className="w-[150px]">Created on</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-normal text-[#333]">
            http://api.example.com/webhooks/cal
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-2">
              <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
              <Tag>After Call Event</Tag>
            </div>
          </TableCell>
          <TableCell className="text-[#333]">Jan 16, 2025</TableCell>
          <TableCell>
            <Badge variant="active">Active</Badge>
          </TableCell>
          <TableCell>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-normal text-[#333]">
            http://api.example.com/webhooks/cal
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-2">
              <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
              <Tag>After Call Event</Tag>
            </div>
          </TableCell>
          <TableCell className="text-[#333]">Jan 16, 2025</TableCell>
          <TableCell>
            <Badge variant="failed">Failed</Badge>
          </TableCell>
          <TableCell>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-normal text-[#333]">
            http://api.example.com/webhooks/caxxxxl
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-2">
              <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
              <Tag>After Call Event</Tag>
              <Tag>After Call Event</Tag>
            </div>
          </TableCell>
          <TableCell className="text-[#333]">Jan 14, 2025</TableCell>
          <TableCell>
            <Badge variant="active">Active</Badge>
          </TableCell>
          <TableCell>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-normal text-[#333]">
            http://api.example.com/webhooks/cal
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-2">
              <Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
              <Tag>After Call Event</Tag>
            </div>
          </TableCell>
          <TableCell className="text-[#333]">Jan 14, 2025</TableCell>
          <TableCell>
            <Badge variant="disabled">Disabled</Badge>
          </TableCell>
          <TableCell>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithCaption: Story = {
  name: 'With Caption',
  render: () => (
    <Table>
      <TableCaption>A list of recent webhooks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>http://api.example.com/webhook</TableCell>
          <TableCell>
            <Badge variant="active">Active</Badge>
          </TableCell>
          <TableCell>Jan 16, 2025</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithFooter: Story = {
  name: 'With Footer',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Product A</TableCell>
          <TableCell>2</TableCell>
          <TableCell className="text-right">$50.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Product B</TableCell>
          <TableCell>1</TableCell>
          <TableCell className="text-right">$25.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Product C</TableCell>
          <TableCell>3</TableCell>
          <TableCell className="text-right">$75.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right font-bold">$150.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const SimpleTable: Story = {
  name: 'Simple Table',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice Johnson</TableCell>
          <TableCell>Developer</TableCell>
          <TableCell>Engineering</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Smith</TableCell>
          <TableCell>Designer</TableCell>
          <TableCell>Product</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Carol Williams</TableCell>
          <TableCell>Manager</TableCell>
          <TableCell>Operations</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const EmptyState: Story = {
  name: 'Empty State',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>URL</TableHead>
          <TableHead>Events</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center py-8 text-gray-500">
            No webhooks found. Create your first webhook to get started.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
