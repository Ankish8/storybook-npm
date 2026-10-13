import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
import { Inbox } from "lucide-react";
import {
  EmptyStates,
  type EmptyStatesProps,
  type EmptyStatesValue,
} from "./empty-states";
import { Button } from "./button";

const contacts = ["Mira Shah", "Owen Lee", "Leena Rao"];

function RecoveryDemo({ states, onAction, ...props }: EmptyStatesProps) {
  const [query, setQuery] = React.useState("Atlas");
  const [connected, setConnected] = React.useState(false);
  const [pendingEdits, setPendingEdits] = React.useState(3);
  const [inbox, setInbox] = React.useState<string[]>([]);
  const [route, setRoute] = React.useState("missing-page");
  const [announcement, setAnnouncement] = React.useState("");
  const matches = contacts.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  function recover(
    value: EmptyStatesValue,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    onAction?.(value, event);
    if (event.defaultPrevented) return;
    switch (value) {
      case "no-results":
        setQuery("");
        setAnnouncement("Filters cleared. Three contacts are available.");
        break;
      case "offline":
        setConnected(true);
        setPendingEdits(0);
        setAnnouncement("Connection restored. Three saved edits synced.");
        break;
      case "caught-up":
        setInbox(["Mira Shah"]);
        setAnnouncement(
          "Inbox refreshed. One new conversation from Mira Shah."
        );
        break;
      case "not-found":
        setRoute("workspace");
        setAnnouncement("Returned to the workspace overview.");
        break;
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <EmptyStates
        {...props}
        onAction={recover}
        states={{
          "no-results": matches.length
            ? {
                title: `${matches.length} contacts found`,
                description: matches.join(" · "),
                actions: (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setQuery("Atlas");
                      setAnnouncement(
                        "Search restored. No contacts match Atlas."
                      );
                    }}
                  >
                    Restore filters
                  </Button>
                ),
              }
            : {
                description: `No contacts match “${query}”. Clear the search to show everyone.`,
              },
          offline: connected
            ? {
                title: "Back online",
                description: `All three saved edits synced. ${pendingEdits} edits waiting.`,
                actions: (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setConnected(false);
                      setPendingEdits(3);
                      setAnnouncement(
                        "Disconnected. Three local edits are waiting."
                      );
                    }}
                  >
                    Disconnect
                  </Button>
                ),
              }
            : {
                description: `${pendingEdits} local edits are waiting. Reconnect to sync them.`,
              },
          "caught-up": inbox.length
            ? {
                title: `${inbox.length} new conversation`,
                description: `${inbox[0]} sent a new message.`,
                actions: (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setInbox([]);
                      setAnnouncement("All conversations marked as read.");
                    }}
                  >
                    Mark all read
                  </Button>
                ),
              }
            : undefined,
          "not-found":
            route === "workspace"
              ? {
                  title: "Workspace overview",
                  description: "Your contacts and conversations are ready.",
                  actions: (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setRoute("missing-page");
                        setAnnouncement("The missing page is open again.");
                      }}
                    >
                      Open missing page
                    </Button>
                  ),
                }
              : undefined,
          ...states,
        }}
      />
      <p
        className="m-0 text-center text-xs leading-5 text-semantic-text-muted"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement || "Choose a view and try its recovery action."}
      </p>
    </div>
  );
}

const meta: Meta<typeof EmptyStates> = {
  title: "V2/Components/EmptyStates",
  component: EmptyStates,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: { include: ["value", "size", "tabListLabel"] },
    docs: {
      description: {
        component: `A compact block with No results, Offline, Caught up and Not found views. It composes the shared EmptyState illustrations with the existing pill Tabs and Button.

\`\`\`bash
npx myoperator-ui add v2-empty-states
\`\`\`

\`\`\`tsx
import { EmptyStates } from "@/components/ui/v2/empty-states";
\`\`\`

Use \`value\` and \`onValueChange\` for controlled selection, or \`defaultValue\` for local selection. Supply \`onAction(value, event)\` to wire the preset recovery buttons. The block never clears data, changes routes or retries a connection itself. Without a handler, preset buttons are omitted. The \`states\` map accepts title, description, icon and actions slots; \`actions={null}\` suppresses a preset button. A custom icon takes precedence over artwork.

EmptyStates is a new v2 block. Existing EmptyState remains available for a single view. There is no v1 EmptyStates API to migrate. V2 source uses unprefixed Tailwind classes.

| Token | CSS variable | Preview |
| --- | --- | --- |
| Surface | \`--semantic-bg-primary\` | <span style="display:inline-block;width:24px;height:16px;border:1px solid var(--semantic-border-layout);background:var(--semantic-bg-primary)"></span> |
| Tab rail | \`--semantic-bg-ui\` | <span style="display:inline-block;width:24px;height:16px;background:var(--semantic-bg-ui)"></span> |
| Border | \`--semantic-border-layout\` | <span style="display:inline-block;width:24px;height:16px;background:var(--semantic-border-layout)"></span> |
| Primary action and focus | \`--semantic-primary\` | <span style="display:inline-block;width:24px;height:16px;background:var(--semantic-primary)"></span> |
| Text | \`--semantic-text-primary\` | <span style="display:inline-block;width:24px;height:16px;background:var(--semantic-text-primary)"></span> |

Arrow keys, Home and End use the existing Tabs keyboard behavior. Tab moves into the selected panel and its actions. Selection keeps focus on the chosen tab; an app-driven selection change restores a hidden panel's focus to the new tab. Motion respects the operating system's reduced-motion setting.

The recovery demo operates on local contacts, queued edits, inbox items and a workspace route. It does not make network requests.`,
      },
    },
  },
  argTypes: {
    value: {
      control: "select",
      options: ["no-results", "offline", "caught-up", "not-found"],
    },
    size: { control: "select", options: ["default", "sm"] },
    states: { control: false },
    onAction: { control: false },
    onValueChange: { control: false },
  },
  args: {
    value: "no-results",
    size: "default",
    tabListLabel: "Empty state",
    onAction: fn(),
    onValueChange: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs<EmptyStatesProps>();
    return (
      <RecoveryDemo
        {...args}
        onValueChange={(next) => {
          args.onValueChange?.(next);
          updateArgs({ value: next });
        }}
      />
    );
  },
};

export const NoResults: Story = {
  args: { value: undefined, defaultValue: "no-results" },
  render: (args) => <RecoveryDemo {...args} />,
};
export const Offline: Story = {
  args: { value: undefined, defaultValue: "offline" },
  render: (args) => <RecoveryDemo {...args} />,
};
export const CaughtUp: Story = {
  args: { value: undefined, defaultValue: "caught-up" },
  render: (args) => <RecoveryDemo {...args} />,
};
export const NotFound: Story = {
  args: { value: undefined, defaultValue: "not-found" },
  render: (args) => <RecoveryDemo {...args} />,
};

export const AllStates: Story = {
  render: () => (
    <div className="grid w-full gap-6 lg:grid-cols-2">
      {(["no-results", "offline", "caught-up", "not-found"] as const).map(
        (value) => (
          <RecoveryDemo key={value} defaultValue={value} size="sm" />
        )
      )}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="grid w-full gap-6 lg:grid-cols-2">
      <RecoveryDemo size="default" aria-label="Default size" />
      <RecoveryDemo size="sm" aria-label="Small size" />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    value: undefined,
    defaultValue: "caught-up",
    states: {
      "caught-up": {
        icon: <Inbox className="size-8" aria-hidden="true" />,
        title: "Your support queue is clear",
        description:
          "Switch views to compare the custom icon and shared artwork.",
      },
    },
  },
  render: (args) => <RecoveryDemo {...args} />,
};

export const WithoutActions: Story = {
  args: { value: undefined, onAction: undefined },
};

export const Keyboard: Story = {
  args: { value: undefined, defaultValue: "no-results" },
  render: (args) => <RecoveryDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "No results" }));
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Offline" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByRole("tab", { name: "Not found" })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Go back" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByText("Workspace overview")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Open missing page" })
    ).toHaveFocus();
  },
};

export const RightToLeft: Story = {
  args: { dir: "rtl", value: undefined, defaultValue: "not-found" },
  render: (args) => <RecoveryDemo {...args} />,
};
