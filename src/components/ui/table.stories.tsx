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
  TableSkeleton,
  TableEmpty,
  TableAvatar,
  type TableColumn,
} from './table'
import { Badge } from './badge'
import { Tag } from './tag'

// Type for sample data
interface EmailData {
  date: string
  subject: string
  sentBy: string
  status: string
  emails: number
}

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Tables are used to organize data, making it easier to understand.

## Import

\`\`\`tsx
import { Table, TableHeader, TableHeaderCell TableBody, TableRow, TableCell } from "@/components/ui/table"
\`\`\`

## Props

The Table component supports both a **composable API** (using children) and a **data-driven API** (using columns and data props).

### Data-driven API

| Prop | Type | Description |
|------|------|-------------|
| columns* | TableColumn[] | Defines the columns of the table |
| data | T[] | Array of data to display |
| dataState | { isLoading?: boolean; isError?: boolean } | State of the data being displayed |
| emptyState* | ReactNode | React element displayed when there is no data |
| errorState* | ReactNode | React element displayed when there is an error |
| size | 'sm' \\| 'md' \\| 'lg' | The row size of the table |

### TableColumn

\`\`\`tsx
interface TableColumn<T> {
  id: string           // Unique identifier
  header: ReactNode    // Header text or component
  cell?: (row: T) => ReactNode  // Custom cell renderer
  accessor?: keyof T   // Key to access row data
  width?: string | number
  sticky?: boolean
  sortDirection?: 'asc' | 'desc' | null
  infoTooltip?: string
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The row size of the table',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    withoutBorder: {
      control: 'boolean',
      description: 'If true, removes the table\'s outer border',
    },
    columns: {
      description: 'Defines the columns of the table',
      table: {
        type: { summary: 'TableColumn[]' },
      },
    },
    data: {
      description: 'Array of data to display in the table',
      table: {
        type: { summary: 'T[]' },
      },
    },
    dataState: {
      description: 'State of the data being displayed (loading or error)',
      table: {
        type: { summary: '{ isLoading?: boolean; isError?: boolean }' },
      },
    },
    emptyState: {
      description: 'React element displayed when there is no data',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    errorState: {
      description: 'React element displayed when there is an error state',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample data
const sampleData: EmailData[] = [
  { date: '2020-01-01', subject: 'Lorem ipsum dolor', sentBy: 'JD', status: 'Sent', emails: 100 },
  { date: '2023-03-03', subject: 'This is the subject This is the subject This is the sub...', sentBy: 'SP', status: 'Sent', emails: 999 },
  { date: '2022-02-02', subject: 'This is the subject', sentBy: 'ON', status: 'Sent', emails: 99 },
]

// Column definitions for data-driven API
const columns: TableColumn<EmailData>[] = [
  { id: 'date', header: 'Sent on', accessor: 'date' },
  { id: 'subject', header: 'Subject', accessor: 'subject' },
  { id: 'sentBy', header: 'Sent by', cell: (row) => <TableAvatar initials={row.sentBy} /> },
  { id: 'status', header: 'Status', cell: (row) => <Badge variant="active">{row.status}</Badge> },
  { id: 'emails', header: 'Emails sent', accessor: 'emails' },
]

export const Overview: Story = {
  args: {
    size: 'md',
    withoutBorder: false,
    columns: columns,
    data: sampleData,
  },
  render: ({ size, withoutBorder, columns, data }) => (
    <Table<EmailData>
      size={size}
      withoutBorder={withoutBorder}
      columns={columns}
      data={data}
      emptyState={<div>No emails found</div>}
    />
  ),
}

export const DataDrivenLoading: Story = {
  name: 'Data-driven: Loading State',
  parameters: {
    docs: {
      description: {
        story: 'Use the dataState prop to show loading state with automatic skeleton rendering.',
      },
    },
  },
  render: () => (
    <Table<EmailData>
      columns={columns}
      data={[]}
      dataState={{ isLoading: true }}
    />
  ),
}

export const DataDrivenEmpty: Story = {
  name: 'Data-driven: Empty State',
  parameters: {
    docs: {
      description: {
        story: 'Use the emptyState prop to show a custom message when there is no data.',
      },
    },
  },
  render: () => (
    <Table<EmailData>
      columns={columns}
      data={[]}
      emptyState={
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg">📭</span>
          <span>No emails found. Send your first email to get started.</span>
        </div>
      }
    />
  ),
}

export const DataDrivenError: Story = {
  name: 'Data-driven: Error State',
  parameters: {
    docs: {
      description: {
        story: 'Use the errorState prop to show a custom error message.',
      },
    },
  },
  render: () => (
    <Table<EmailData>
      columns={columns}
      data={[]}
      dataState={{ isError: true }}
      errorState={
        <div className="flex flex-col items-center gap-2 text-red-500">
          <span className="text-lg">⚠️</span>
          <span>Failed to load data. Please try again.</span>
        </div>
      }
    />
  ),
}

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: 'The table is available in 3 different row heights: small (32px), medium (40px), and large (48px). Medium size is the default size.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="text-sm font-medium mb-2">Small</h4>
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Sent on</TableHead>
              <TableHead>Subject</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2020-01-01</TableCell>
              <TableCell>Lorem ipsum dolor</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2022-02-02</TableCell>
              <TableCell>This is the subject</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Medium (default)</h4>
        <Table size="md">
          <TableHeader>
            <TableRow>
              <TableHead>Sent on</TableHead>
              <TableHead>Subject</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2020-01-01</TableCell>
              <TableCell>Lorem ipsum dolor</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2022-02-02</TableCell>
              <TableCell>This is the subject</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Large</h4>
        <Table size="lg">
          <TableHeader>
            <TableRow>
              <TableHead>Sent on</TableHead>
              <TableHead>Subject</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2020-01-01</TableCell>
              <TableCell>Lorem ipsum dolor</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2022-02-02</TableCell>
              <TableCell>This is the subject</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  ),
}

export const Borders: Story = {
  name: 'Borders',
  parameters: {
    docs: {
      description: {
        story: 'The table is available with or without an outer border. When using a table inside another component (like a modal or dialog), remove the table\'s outer border for a cleaner look.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="text-sm font-medium mb-2">With Border (default)</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sent on</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Sent by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Emails sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell><TableAvatar initials={row.sentBy} /></TableCell>
                <TableCell><Badge variant="active">{row.status}</Badge></TableCell>
                <TableCell>{row.emails}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Without Border</h4>
        <Table withoutBorder>
          <TableHeader>
            <TableRow>
              <TableHead>Sent on</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Sent by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Emails sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell><TableAvatar initials={row.sentBy} /></TableCell>
                <TableCell><Badge variant="active">{row.status}</Badge></TableCell>
                <TableCell>{row.emails}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
}

export const HeaderFunctionality: Story = {
  name: 'Table header functionality',
  parameters: {
    docs: {
      description: {
        story: 'Sorting, Icons and Information added to selected columns.',
      },
    },
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sent on</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead infoTooltip="The user who sent the email">Sent by</TableHead>
          <TableHead infoTooltip="Current status of the email">Status</TableHead>
          <TableHead>Emails sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((row, i) => (
          <TableRow key={i}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.subject}</TableCell>
            <TableCell><TableAvatar initials={row.sentBy} /></TableCell>
            <TableCell><Badge variant="active">{row.status}</Badge></TableCell>
            <TableCell>{row.emails}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const Loading: Story = {
  name: 'Loading',
  parameters: {
    docs: {
      description: {
        story: 'Using skeleton to show loading state.',
      },
    },
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sent on</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Sent by</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Emails sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableSkeleton rows={5} columns={5} />
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
          <TableHead>Sent on</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Sent by</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Emails sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={5}>
          No emails found. Send your first email to get started.
        </TableEmpty>
      </TableBody>
    </Table>
  ),
}

export const HighlightedRow: Story = {
  name: 'Highlighted row',
  parameters: {
    docs: {
      description: {
        story: 'Use a highlighted row to mark a single row of the table. A highlighted row allows adding additional information for the entire row, using a system trigger such as a side-panel or modal.',
      },
    },
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sent on</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Sent by</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Emails sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>2020-01-01</TableCell>
          <TableCell>Lorem ipsum dolor</TableCell>
          <TableCell><TableAvatar initials="JD" /></TableCell>
          <TableCell><Badge variant="active">Sent</Badge></TableCell>
          <TableCell>100</TableCell>
        </TableRow>
        <TableRow highlighted>
          <TableCell>2022-02-02</TableCell>
          <TableCell>This is the subject</TableCell>
          <TableCell><TableAvatar initials="ON" color="#F59E0B" /></TableCell>
          <TableCell><Badge variant="active">Sent</Badge></TableCell>
          <TableCell>99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2023-03-03</TableCell>
          <TableCell>This is the subject This is the subject This is the sub...</TableCell>
          <TableCell><TableAvatar initials="SP" color="#10B981" /></TableCell>
          <TableCell><Badge variant="active">Sent</Badge></TableCell>
          <TableCell>999</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const StickyColumn: Story = {
  name: 'Sticky column',
  parameters: {
    docs: {
      description: {
        story: 'Use sticky column in your table when you want to keep specific column visible while the users scroll horizontally.',
      },
    },
  },
  render: () => (
    <div className="max-w-[600px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sticky>Project name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created on</TableHead>
            <TableHead>Emails sent</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell sticky>Limited time offer</TableCell>
            <TableCell><Badge variant="active">In progress</Badge></TableCell>
            <TableCell>This is des...</TableCell>
            <TableCell>2024-07-03</TableCell>
            <TableCell>100</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>High</TableCell>
            <TableCell>Marketing</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sticky>Action required</TableCell>
            <TableCell><Badge variant="active">In progress</Badge></TableCell>
            <TableCell>This is des...</TableCell>
            <TableCell>2024-07-08</TableCell>
            <TableCell>150</TableCell>
            <TableCell>Jane Smith</TableCell>
            <TableCell>Medium</TableCell>
            <TableCell>Sales</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sticky>Cancellation request</TableCell>
            <TableCell><Badge variant="active">Done</Badge></TableCell>
            <TableCell>This is des...</TableCell>
            <TableCell>2024-07-12</TableCell>
            <TableCell>300</TableCell>
            <TableCell>Mark Johnson</TableCell>
            <TableCell>Low</TableCell>
            <TableCell>Support</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}

export const Scroll: Story = {
  name: 'Scroll',
  parameters: {
    docs: {
      description: {
        story: 'Table with both vertical and horizontal scroll.',
      },
    },
  },
  render: () => {
    const priorityColors: Record<string, string> = {
      Urgent: '#EF4444',
      High: '#3B82F6',
      Normal: '#6B7280',
      Low: '#10B981',
    }

    const statusVariants: Record<string, 'active' | 'failed' | 'disabled'> = {
      'In progress': 'active',
      Queued: 'disabled',
      Failed: 'failed',
      Sent: 'active',
    }

    const scrollData = [
      { date: '2020-01-01', priority: 'Urgent', subject: 'Lorem ipsum dolor', sentBy: 'JD', status: 'In progress', emails: 100 },
      { date: '2020-02-02', priority: 'High', subject: 'Dolor sit amet', sentBy: 'JD', status: 'In progress', emails: 50 },
      { date: '2020-03-03', priority: 'Normal', subject: 'Consectetur adipiscing elit', sentBy: 'PS', status: 'Queued', emails: 0 },
      { date: '2020-04-04', priority: 'Low', subject: 'Sed do eiusmod tempor incididunt', sentBy: 'SJ', status: 'Failed', emails: 200 },
      { date: '2020-05-05', priority: 'Urgent', subject: 'Ut labore et dolore magna aliqua', sentBy: 'JD', status: 'Sent', emails: 150 },
    ]

    return (
      <div className="max-h-[250px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sent on</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Sent by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Emails sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scrollData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-white text-xs" style={{ backgroundColor: priorityColors[row.priority] }}>
                    {row.priority}
                  </span>
                </TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell><TableAvatar initials={row.sentBy} /></TableCell>
                <TableCell><Badge variant={statusVariants[row.status]}>{row.status}</Badge></TableCell>
                <TableCell>{row.emails}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
}

export const WebhookTable: Story = {
  name: 'Webhook Table Example',
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing how to compose Table, Badge, and Tag components together.',
      },
    },
  },
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
