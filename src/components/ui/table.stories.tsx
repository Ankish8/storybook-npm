import type { Meta, StoryObj } from '@storybook/react'
import { MoreVertical, Edit, Copy, Trash } from 'lucide-react'
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
} from './table'
import { Badge } from './badge'
import { Tag } from './tag'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Tables are used to organize data, making it easier to understand.

## Import

\`\`\`tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  TableEmpty,
  TableAvatar
} from "@/components/ui/table"
\`\`\`

## Usage

\`\`\`tsx
<Table size="md" withoutBorder={false}>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell><Badge variant="active">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
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
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    withoutBorder: {
      control: 'boolean',
      description: 'Remove outer border from the table',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample data for stories
const sampleData = [
  { date: '2020-01-01', subject: 'Lorem ipsum dolor', sentBy: 'JD', status: 'Sent', emails: 100 },
  { date: '2023-03-03', subject: 'This is the subject This is the subject This is the sub...', sentBy: 'SP', status: 'Sent', emails: 999 },
  { date: '2022-02-02', subject: 'This is the subject', sentBy: 'ON', status: 'Sent', emails: 99 },
]

export const Overview: Story = {
  args: {
    size: 'md',
    withoutBorder: false,
  },
  render: ({ size, withoutBorder }) => (
    <Table size={size} withoutBorder={withoutBorder}>
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
  tags: ['!dev'],
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
            <TableCell><Badge variant="default">Done</Badge></TableCell>
            <TableCell>This is des...</TableCell>
            <TableCell>2024-07-12</TableCell>
            <TableCell>300</TableCell>
            <TableCell>Mark Johnson</TableCell>
            <TableCell>Low</TableCell>
            <TableCell>Support</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sticky>Limited time offer</TableCell>
            <TableCell><Badge variant="failed">Stuck</Badge></TableCell>
            <TableCell>This is des...</TableCell>
            <TableCell>2024-08-06</TableCell>
            <TableCell>50</TableCell>
            <TableCell>Lucy Brown</TableCell>
            <TableCell>High</TableCell>
            <TableCell>Marketing</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sticky>Cancellation request</TableCell>
            <TableCell><Badge variant="default">Done</Badge></TableCell>
            <TableCell>This is des...</TableCell>
            <TableCell>2024-09-05</TableCell>
            <TableCell>400</TableCell>
            <TableCell>Alan Turing</TableCell>
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
    const priorityVariants: Record<string, 'active' | 'failed' | 'disabled' | 'default'> = {
      Urgent: 'failed',
      High: 'active',
      Normal: 'disabled',
      Low: 'default',
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
                  <Badge variant={priorityVariants[row.priority]}>{row.priority}</Badge>
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

export const VirtualizedScroll: Story = {
  name: 'Virtualized Scroll',
  parameters: {
    docs: {
      description: {
        story: 'This is an example of a table with 5000 rows. For large datasets, consider implementing virtualization for better performance.',
      },
    },
  },
  render: () => {
    // Generate 100 rows for demo (in production, use virtualization library for 5000+ rows)
    const virtualData = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `User${i}`,
      email: `user${i}@example.com`,
      col1: `Value ${i}-1`,
      col2: `Value ${i}-2`,
      col3: `Value ${i}-3`,
      col4: `Value ${i}-4`,
      col5: `Value ${i}-5`,
    }))

    return (
      <div className="max-h-[300px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Column 1</TableHead>
              <TableHead>Column 2</TableHead>
              <TableHead>Column 3</TableHead>
              <TableHead>Column 4</TableHead>
              <TableHead>Column 5</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {virtualData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.col1}</TableCell>
                <TableCell>{row.col2}</TableCell>
                <TableCell>{row.col3}</TableCell>
                <TableCell>{row.col4}</TableCell>
                <TableCell>{row.col5}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },
}

export const DosAndDonts: Story = {
  name: "Do's and Don'ts",
  tags: ['!dev'],
  parameters: {
    docs: {
      description: {
        story: 'Best practices for using the Table component.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      {/* Icons example */}
      <div className="flex gap-8">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>📅 Sent on</TableHead>
                <TableHead>📄 Subject</TableHead>
                <TableHead>📊 Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Apr 22</TableCell>
                <TableCell>Limited time offer: AP Process</TableCell>
                <TableCell><Badge variant="active">In progress</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Apr 22</TableCell>
                <TableCell>Action required: Update your AP</TableCell>
                <TableCell><Badge variant="disabled">Queued</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Apr 22</TableCell>
                <TableCell>Limited time offer: AP Process</TableCell>
                <TableCell><Badge variant="active">Sent</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">If there's a need to insert an icon, use for all columns.</p>
        </div>
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sent on</TableHead>
                <TableHead>📄 Subject</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Apr 22</TableCell>
                <TableCell>Limited time offer: AP Process</TableCell>
                <TableCell><Badge variant="active">In progress</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Apr 22</TableCell>
                <TableCell>Action required: Update your AP</TableCell>
                <TableCell><Badge variant="disabled">Queued</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Apr 22</TableCell>
                <TableCell>Limited time offer: AP Process</TableCell>
                <TableCell><Badge variant="active">Sent</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Don't use icons if not applied to all columns titles.</p>
        </div>
      </div>

      {/* Borders example */}
      <div className="flex gap-8">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sent on</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Emails sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2020-01-01</TableCell>
                <TableCell>Lorem ipsum dolor</TableCell>
                <TableCell>100</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2022-02-02</TableCell>
                <TableCell>This is the subject</TableCell>
                <TableCell>99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-03-03</TableCell>
                <TableCell>This is another subject</TableCell>
                <TableCell>999</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-600 text-lg">✓</span>
            <span className="font-medium">Do</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">If there's a need, remove only the outer border.</p>
        </div>
        <div className="flex-1">
          <Table withoutBorder>
            <TableHeader>
              <TableRow>
                <TableHead>Sent on</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Emails sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-0">
                <TableCell>2020-01-01</TableCell>
                <TableCell>Lorem ipsum dolor</TableCell>
                <TableCell>100</TableCell>
              </TableRow>
              <TableRow className="border-0">
                <TableCell>2022-02-02</TableCell>
                <TableCell>This is the subject</TableCell>
                <TableCell>99</TableCell>
              </TableRow>
              <TableRow className="border-0">
                <TableCell>2023-03-03</TableCell>
                <TableCell>This is another subject</TableCell>
                <TableCell>999</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-red-600 text-lg">✗</span>
            <span className="font-medium">Don't</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Don't remove border between the rows.</p>
        </div>
      </div>
    </div>
  ),
}

export const WebhookTable: Story = {
  name: 'Webhook Table Example',
  tags: ['!dev'],
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
