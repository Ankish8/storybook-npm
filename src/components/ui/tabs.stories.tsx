import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Badge } from "./badge";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A flexible tabs component built on Radix UI Tabs, with an underline-style active indicator. Supports badges/counts, full-width equal tabs, and auto-width tabs.

\`\`\`bash
npx myoperator-ui add tabs
\`\`\`

## Import

\`\`\`tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
\`\`\`

## Usage

\`\`\`tsx
{/* Auto-width tabs */}
<Tabs defaultValue="variables">
  <TabsList>
    <TabsTrigger value="variables">Template variables</TabsTrigger>
    <TabsTrigger value="media">Media</TabsTrigger>
  </TabsList>
  <TabsContent value="variables">...</TabsContent>
  <TabsContent value="media">...</TabsContent>
</Tabs>

{/* Full-width tabs with badges */}
<Tabs defaultValue="open">
  <TabsList fullWidth>
    <TabsTrigger value="open">Open <Badge>10</Badge></TabsTrigger>
    <TabsTrigger value="assigned">Assigned <Badge>2</Badge></TabsTrigger>
  </TabsList>
  <TabsContent value="open">...</TabsContent>
</Tabs>
\`\`\`

## Design Tokens

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Token</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Variable</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Value</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Active Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">181D27</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #181D27; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Active Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-primary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">343E55</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #343E55; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Inactive Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-muted</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">717680</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #717680; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Hover Text</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-text-secondary</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">414651</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #414651; border-radius: 6px; border: 1px solid #E9EAEB;"></div></td>
    </tr>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">List Border</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">--semantic-border-layout</code></td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px !important;">E9EAEB</td>
      <td style="padding: 12px 16px;"><div style="width: 32px; height: 32px; background-color: #E9EAEB; border-radius: 6px; border: 1px solid #D5D7DA;"></div></td>
    </tr>
  </tbody>
</table>

## Typography

<table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
  <thead>
    <tr style="background-color: #FAFAFA; border-bottom: 2px solid #E9EAEB;">
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Element</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">Size / Weight</th>
      <th style="padding: 12px 16px; text-align: left; font-weight: 600;">CSS Class</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #E9EAEB;">
      <td style="padding: 12px 16px;">Tab Trigger</td>
      <td style="padding: 12px 16px; font-family: monospace; font-size: 13px;">14px / Medium (500)</td>
      <td style="padding: 12px 16px;"><code style="background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 12px;">text-sm font-medium</code></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Overview
export const Overview: Story = {
  render: () => (
    <div className="w-[400px]">
      <Tabs defaultValue="variables">
        <TabsList>
          <TabsTrigger value="variables">Template variables</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        <TabsContent value="variables">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Template variables content goes here.
          </div>
        </TabsContent>
        <TabsContent value="media">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Media upload content goes here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

// Full Width with Badges (inbox-style)
export const FullWidthWithBadges: Story = {
  name: "Full width with badges",
  render: () => (
    <div className="w-[360px]">
      <Tabs defaultValue="open">
        <TabsList fullWidth>
          <TabsTrigger value="open">
            Open
            <Badge variant="primary" size="sm">
              10
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned">
            Assigned
            <Badge variant="default" size="sm">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved
            <Badge variant="default" size="sm">
              5
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Open conversations list
          </div>
        </TabsContent>
        <TabsContent value="assigned">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Assigned conversations list
          </div>
        </TabsContent>
        <TabsContent value="resolved">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Resolved conversations list
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

// Auto Width (default)
export const AutoWidth: Story = {
  name: "Auto width",
  render: () => (
    <div className="w-[500px]">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="p-4 text-sm text-semantic-text-secondary">
            General settings
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Notification preferences
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Security settings
          </div>
        </TabsContent>
        <TabsContent value="integrations">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Integration connections
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

// Controlled
const ControlledExample = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="w-[400px]">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
          <TabsTrigger value="tab3">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="p-4 text-sm text-semantic-text-secondary">
            First tab content (controlled)
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Second tab content (controlled)
          </div>
        </TabsContent>
        <TabsContent value="tab3">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Third tab content (controlled)
          </div>
        </TabsContent>
      </Tabs>
      <p className="m-0 mt-2 text-xs text-semantic-text-muted">
        Active tab: {activeTab}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// With Disabled Tab
export const WithDisabledTab: Story = {
  name: "With disabled tab",
  render: () => (
    <div className="w-[400px]">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
          <TabsTrigger value="another">Another</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Active tab content
          </div>
        </TabsContent>
        <TabsContent value="another">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Another tab content
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

// Two Tabs (simple)
export const TwoTabs: Story = {
  name: "Two tabs",
  render: () => (
    <div className="w-[400px]">
      <Tabs defaultValue="variables">
        <TabsList>
          <TabsTrigger value="variables">Template variables</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        <TabsContent value="variables">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Variables mapping content
          </div>
        </TabsContent>
        <TabsContent value="media">
          <div className="p-4 text-sm text-semantic-text-secondary">
            Media upload content
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
