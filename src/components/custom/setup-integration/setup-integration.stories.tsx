import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"
import React, { useState } from "react"
import { Plus } from "lucide-react"
import { SetupIntegration } from "./setup-integration"
import { SetupIntegrationView } from "./setup-integration-view"
import { Button } from "../../ui/button"
import type {
  ChatMessage,
  SetupIntegrationProps,
  SetupIntegrationAction,
} from "./types"

/* ================================================================== */
/* Sample message sets for each Figma state                            */
/* ================================================================== */

const defaultMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
]

const mappingMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
  {
    id: "3",
    role: "assistant",
    content: "Mapping tool.",
    variant: "status",
  },
]

const midConversationMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "I've set up the Google Sheets 'Add Row' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.",
  },
]

const testingMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "I've set up the Google Sheets 'Add Row' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Welcome to the Test Phase. Let's verify the integration before publishing.\n\nPlease provide a test value for the variable: {{row_data}}",
    statusLabel: "Running test...",
  },
]

const activeConfigMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "I've set up the Google Sheets 'Add Row' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Welcome to the Test Phase. Let's verify the integration before publishing.\n\nPlease provide a test value for the variable: {{row_data}}",
    statusLabel: "Running test...",
  },
  {
    id: "5",
    role: "user",
    content: "data",
  },
  {
    id: "6",
    role: "assistant",
    content:
      "Test successful! The tool call was executed correctly. You can now publish the integration.",
    variant: "success",
  },
]

/* ================================================================== */
/* Trigger button                                                      */
/* ================================================================== */

const SetupTrigger = ({ onClick }: { onClick: () => void }) => (
  <Button variant="outline" onClick={onClick}>
    <Plus className="size-4" />
    Integrations
  </Button>
)

/* ================================================================== */
/* Modal wrapper for args-based stories                                */
/* ================================================================== */

const ModalStory = (props: SetupIntegrationProps) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(props.inputValue ?? "")

  return (
    <>
      <SetupTrigger onClick={() => setOpen(true)} />
      <SetupIntegration
        {...props}
        open={open}
        onOpenChange={setOpen}
        inputValue={inputValue}
        onInputChange={(v) => {
          setInputValue(v)
          props.onInputChange?.(v)
        }}
        onClose={() => {
          props.onClose?.()
          setOpen(false)
        }}
      />
    </>
  )
}

/* ================================================================== */
/* Meta                                                                */
/* ================================================================== */

const meta: Meta<typeof SetupIntegration> = {
  title: "Custom/AI Bot/Composio/SetupIntegration",
  component: SetupIntegration,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
AI chat interface for setting up and testing integrations after a successful connection. Uses an OpenAI-compatible message format for seamless integration with AI backends.

\`\`\`bash
npx myoperator-ui add setup-integration
\`\`\`

## Import

\`\`\`tsx
import { SetupIntegration } from "@/components/custom/setup-integration"
import type { ChatMessage } from "@/components/custom/setup-integration"
\`\`\`

## Usage

\`\`\`tsx
const [open, setOpen] = useState(false)
const [messages, setMessages] = useState<ChatMessage[]>([
  { id: "1", role: "assistant", content: "How can I help?" }
])

<SetupIntegration
  open={open}
  onOpenChange={setOpen}
  messages={messages}
  onSendMessage={(msg) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: msg }])
    // Call your AI API, then append assistant response
  }}
  onAction={() => { /* test or publish */ }}
  onClose={() => setOpen(false)}
/>
\`\`\`

## Message Format (OpenAI-compatible)

\`\`\`ts
interface ChatMessage {
  id: string                                    // React key
  role: "assistant" | "user"                    // OpenAI-compatible
  content: string                               // Message text
  variant?: "default" | "success" | "error" | "status"  // UI styling
}
\`\`\`

## Design Tokens

<table>
  <thead>
    <tr>
      <th>Token</th>
      <th>CSS Variable</th>
      <th>Usage</th>
      <th>Preview</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Info Surface Subtle</td>
      <td><code>--semantic-info-surface-subtle</code></td>
      <td>AI Assistant bar background</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-info-surface-subtle);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Info Surface</td>
      <td><code>--semantic-info-surface</code></td>
      <td>Assistant message bubble, avatar circle</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-info-surface);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Success Surface</td>
      <td><code>--semantic-success-surface</code></td>
      <td>Success message bubble</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-success-surface);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Error Surface</td>
      <td><code>--semantic-error-surface</code></td>
      <td>Error message bubble (AI failure)</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-error-surface);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Error Text</td>
      <td><code>--semantic-error-text</code></td>
      <td>Error message text</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-error-text);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Background UI</td>
      <td><code>--semantic-bg-ui</code></td>
      <td>User message bubble, avatar circle</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-bg-ui);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Text Muted</td>
      <td><code>--semantic-text-muted</code></td>
      <td>Status text, placeholder, AI icon</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-text-muted);border:1px solid #e5e7eb" /></td>
    </tr>
    <tr>
      <td>Border Layout</td>
      <td><code>--semantic-border-layout</code></td>
      <td>Section dividers</td>
      <td><div style="width:24px;height:24px;border-radius:4px;background:var(--semantic-border-layout);border:1px solid #e5e7eb" /></td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: false },
    onOpenChange: { control: false },
    actionMode: {
      control: "select",
      options: ["test", "publish"],
    },
    title: { control: "text" },
    subtitle: { control: "text" },
    actionLabel: { control: "text" },
    isActionDisabled: { control: "boolean" },
    isActionLoading: { control: "boolean" },
    isInputDisabled: { control: "boolean" },
    inputPlaceholder: { control: "text" },
  },
  args: {
    onClose: fn(),
    onBack: fn(),
    onInputChange: fn(),
    onSendMessage: fn(),
    onAction: fn(),
    onResetChat: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

/* ================================================================== */
/* Individual State Stories                                             */
/* ================================================================== */

// ---------- Default: Initial assistant greeting ----------
export const Default: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: defaultMessages,
    title: "Setup Integration",
    subtitle: "Step 3 of 4",
    actionLabel: "Test Integration",
    isActionDisabled: true,
    actionMode: "test",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Initial state — single assistant greeting message. Test Integration button is disabled until the user configures an action.",
      },
    },
  },
}

// ---------- Mapping: User sent action, AI is mapping ----------
export const Mapping: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: mappingMessages,
    title: "Setup Integration",
    subtitle: "Step 3 of 4",
    actionLabel: "Test Integration",
    isActionDisabled: true,
    isInputDisabled: true,
    actionMode: "test",
  },
  parameters: {
    docs: {
      description: {
        story:
          'User sent "Add Row", AI is mapping the tool. Input and action button are disabled during processing.',
      },
    },
  },
}

// ---------- Mid-conversation: Ready to test ----------
export const MidConversation: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: midConversationMessages,
    title: "Test Integration",
    subtitle: "Step 4 of 4",
    actionLabel: "Test Integration",
    isActionDisabled: false,
    actionMode: "test",
  },
  parameters: {
    docs: {
      description: {
        story:
          "AI has finished configuring the action. Test Integration button is now enabled.",
      },
    },
  },
}

// ---------- Testing: Running test with spinner ----------
export const Testing: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: testingMessages,
    title: "Test Integration",
    subtitle: "Step 4 of 4",
    actionLabel: "Test Integration",
    isActionLoading: true,
    isInputDisabled: true,
    actionMode: "test",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test in progress — "Running test..." status message, spinner on button, input disabled.',
      },
    },
  },
}

// ---------- Active Configuration: Test passed, ready to publish ----------
export const ActiveConfiguration: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: activeConfigMessages,
    title: "Test Integration",
    subtitle: "Step 4 of 4",
    actionLabel: "Publish Integration",
    isActionDisabled: false,
    actionMode: "publish",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Test passed — green success message bubble. Publish Integration button is enabled with primary styling.",
      },
    },
  },
}

// ---------- Setup Error: AI processing failure ----------
const setupErrorMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Something went wrong processing your message. Please try again.",
    variant: "error",
  },
]

export const SetupError: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: setupErrorMessages,
    title: "Setup Integration",
    subtitle: "Step 3 of 4",
    actionLabel: "Test Integration",
    isActionDisabled: true,
    actionMode: "test",
  },
  parameters: {
    docs: {
      description: {
        story:
          "AI failed to process the user message — red error bubble shown. User can retry by sending another message.",
      },
    },
  },
}

// ---------- Test Failed: Invalid test value ----------
const testFailedMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "I've set up the Google Sheets 'Add Row' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Welcome to the Test Phase. Let's verify the integration before publishing.\n\nPlease provide a test value for the variable: {{row_data}}",
    statusLabel: "Running test...",
  },
  {
    id: "5",
    role: "user",
    content: "data",
  },
  {
    id: "6",
    role: "assistant",
    content: "Invalid test value! Please try again.",
    variant: "error",
  },
]

export const TestFailed: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: testFailedMessages,
    title: "Configure Integration",
    subtitle: "Step 3 of 3",
    actionLabel: "Publish Integration",
    isActionDisabled: false,
    actionMode: "publish",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test failed — red error bubble "Invalid test value! Please try again." User can retry with a different value.',
      },
    },
  },
}

/* ================================================================== */
/* Scenario: Full interactive flow                                     */
/* ================================================================== */

const ScenarioFullFlowExample = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isInputDisabled, setIsInputDisabled] = useState(false)
  const [isActionDisabled, setIsActionDisabled] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionLabel, setActionLabel] = useState("Test Integration")
  const [actionMode, setActionMode] = useState<SetupIntegrationAction>("test")
  const [title, setTitle] = useState("Setup Integration")
  const [subtitle, setSubtitle] = useState("Step 3 of 4")
  const [hasConfigured, setHasConfigured] = useState(false)
  const [hasTested, setHasTested] = useState(false)

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }

  const handleSendMessage = (text: string) => {
    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: text,
    })
    setInputValue("")
    setIsInputDisabled(true)

    // Simulate mapping status
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Mapping tool.",
        variant: "status",
      })
    }, 500)

    // Simulate assistant response
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `I've set up the Google Sheets '${text}' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.`,
      })
      setIsInputDisabled(false)
      setIsActionDisabled(false)
      setHasConfigured(true)
      setTitle("Test Integration")
      setSubtitle("Step 4 of 4")
    }, 2000)
  }

  const handleAction = () => {
    if (!hasTested && hasConfigured) {
      // Test flow
      setIsActionLoading(true)
      setIsInputDisabled(true)

      addMessage({
        id: (Date.now() + 3).toString(),
        role: "assistant",
        content:
          "Welcome to the Test Phase. Let's verify the integration before publishing.\n\nPlease provide a test value for the variable: {{row_data}}",
        statusLabel: "Running test...",
      })

      setTimeout(() => {
        setIsActionLoading(false)
        setIsInputDisabled(false)
        setHasTested(true)
        setActionLabel("Publish Integration")
        setActionMode("publish")

        addMessage({
          id: (Date.now() + 4).toString(),
          role: "assistant",
          content:
            "Test successful! The tool call was executed correctly. You can now publish the integration.",
          variant: "success",
        })
      }, 2500)
    } else if (hasTested) {
      // Publish
      setOpen(false)
      console.log("Published!")
    }
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
      },
    ])
    setInputValue("")
    setIsInputDisabled(false)
    setIsActionDisabled(true)
    setIsActionLoading(false)
    setActionLabel("Test Integration")
    setActionMode("test")
    setTitle("Setup Integration")
    setSubtitle("Step 3 of 4")
    setHasConfigured(false)
    setHasTested(false)
  }

  const handleClose = () => {
    setOpen(false)
    handleResetChat()
  }

  return (
    <>
      <SetupTrigger onClick={() => setOpen(true)} />
      <SetupIntegration
        open={open}
        onOpenChange={setOpen}
        title={title}
        subtitle={subtitle}
        messages={messages}
        inputValue={inputValue}
        isInputDisabled={isInputDisabled}
        isActionDisabled={isActionDisabled}
        isActionLoading={isActionLoading}
        actionLabel={actionLabel}
        actionMode={actionMode}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onAction={handleAction}
        onResetChat={handleResetChat}
        onClose={handleClose}
        onBack={handleClose}
      />
    </>
  )
}

export const Scenario_FullFlow: Story = {
  render: () => <ScenarioFullFlowExample />,
  parameters: {
    docs: {
      description: {
        story: `**Full Interactive Flow**

Flow: Greeting → Type action → Mapping → Configured → Test → Success → Publish

1. Click **"+ Integrations"** to open
2. Type an action (e.g., "Add Row") and press Enter
3. Watch the AI map and configure the tool (~2s)
4. Click **"Test Integration"** to run the test (~2.5s)
5. Success message appears, button changes to **"Publish Integration"**
6. Click **"Publish Integration"** to complete
7. Use **"Reset Chat"** to start over at any point`,
      },
    },
  },
}

/* ================================================================== */
/* Scenario 5: Setup Agent AI Failure                                  */
/* ================================================================== */

const Scenario5Example = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isInputDisabled, setIsInputDisabled] = useState(false)
  const [isActionDisabled, setIsActionDisabled] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionLabel, setActionLabel] = useState("Test Integration")
  const [actionMode, setActionMode] = useState<SetupIntegrationAction>("test")
  const [title, setTitle] = useState("Setup Integration")
  const [subtitle, setSubtitle] = useState("Step 3 of 4")
  const [hasConfigured, setHasConfigured] = useState(false)
  const [hasTested, setHasTested] = useState(false)
  const [failCount, setFailCount] = useState(0)

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }

  const handleSendMessage = (text: string) => {
    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: text,
    })
    setInputValue("")
    setIsInputDisabled(true)

    // First attempt → AI failure
    if (failCount === 0) {
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Something went wrong processing your message. Please try again.",
          variant: "error",
        })
        setIsInputDisabled(false)
        setFailCount(1)
      }, 1000)
      return
    }

    // Retry → mapping then success
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Mapping tool.",
        variant: "status",
      })
    }, 500)

    setTimeout(() => {
      addMessage({
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `I've set up the Google Sheets '${text}' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.`,
      })
      setIsInputDisabled(false)
      setIsActionDisabled(false)
      setHasConfigured(true)
      setTitle("Test Integration")
      setSubtitle("Step 4 of 4")
    }, 2000)
  }

  const handleAction = () => {
    if (!hasTested && hasConfigured) {
      setIsActionLoading(true)
      setIsInputDisabled(true)

      addMessage({
        id: (Date.now() + 3).toString(),
        role: "assistant",
        content:
          "Welcome to the Test Phase. Let's verify the integration before publishing.\n\nPlease provide a test value for the variable: {{row_data}}",
        statusLabel: "Running test...",
      })

      setTimeout(() => {
        setIsActionLoading(false)
        setIsInputDisabled(false)
        setHasTested(true)
        setActionLabel("Publish Integration")
        setActionMode("publish")

        addMessage({
          id: (Date.now() + 4).toString(),
          role: "assistant",
          content:
            "Test successful! The tool call was executed correctly. You can now publish the integration.",
          variant: "success",
        })
      }, 2500)
    } else if (hasTested) {
      setOpen(false)
    }
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
      },
    ])
    setInputValue("")
    setIsInputDisabled(false)
    setIsActionDisabled(true)
    setIsActionLoading(false)
    setActionLabel("Test Integration")
    setActionMode("test")
    setTitle("Setup Integration")
    setSubtitle("Step 3 of 4")
    setHasConfigured(false)
    setHasTested(false)
    setFailCount(0)
  }

  const handleClose = () => {
    setOpen(false)
    handleResetChat()
  }

  return (
    <>
      <SetupTrigger onClick={() => setOpen(true)} />
      <SetupIntegration
        open={open}
        onOpenChange={setOpen}
        title={title}
        subtitle={subtitle}
        messages={messages}
        inputValue={inputValue}
        isInputDisabled={isInputDisabled}
        isActionDisabled={isActionDisabled}
        isActionLoading={isActionLoading}
        actionLabel={actionLabel}
        actionMode={actionMode}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onAction={handleAction}
        onResetChat={handleResetChat}
        onClose={handleClose}
        onBack={handleClose}
      />
    </>
  )
}

export const Scenario5_SetupAgentAIFailure: Story = {
  render: () => <Scenario5Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 5 — Setup Agent AI Failure**

Flow: Greeting → User sends action → AI fails (error bubble) → User retries → AI succeeds → Test → Success → Publish

1. Click **"+ Integrations"** to open
2. Type an action (e.g., "Add Row") and press Enter
3. AI fails — red error bubble: "Something went wrong processing your message. Please try again."
4. Retry by sending the same action again
5. AI recovers — maps and configures the tool (~2s)
6. Click **"Test Integration"** to run the test (~2.5s)
7. Success message appears, button changes to **"Publish Integration"**`,
      },
    },
  },
}

/* ================================================================== */
/* Scenario 6: Reset Chat                                              */
/* ================================================================== */

const Scenario6Example = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
    },
    {
      id: "2",
      role: "user",
      content: "Add Row",
    },
    {
      id: "3",
      role: "assistant",
      content:
        "I've set up the Google Sheets 'Add Row' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isActionDisabled, setIsActionDisabled] = useState(false)
  const [title, setTitle] = useState("Test Integration")
  const [subtitle, setSubtitle] = useState("Step 4 of 4")

  const handleResetChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
      },
    ])
    setInputValue("")
    setIsActionDisabled(true)
    setTitle("Setup Integration")
    setSubtitle("Step 3 of 4")
  }

  const handleClose = () => {
    setOpen(false)
    handleResetChat()
  }

  return (
    <>
      <SetupTrigger onClick={() => setOpen(true)} />
      <SetupIntegration
        open={open}
        onOpenChange={setOpen}
        title={title}
        subtitle={subtitle}
        messages={messages}
        inputValue={inputValue}
        isActionDisabled={isActionDisabled}
        actionLabel="Test Integration"
        actionMode="test"
        onInputChange={setInputValue}
        onResetChat={handleResetChat}
        onClose={handleClose}
        onBack={handleClose}
      />
    </>
  )
}

export const Scenario6_ResetChat: Story = {
  render: () => <Scenario6Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 6 — Reset Chat**

Flow: Mid-conversation → Click "Reset Chat" → Confirmation modal → Confirm → Chat resets to default

1. Click **"+ Integrations"** to open (starts mid-conversation)
2. Click **"Reset Chat"** in the AI Assistant bar
3. Confirmation modal appears: "Reset Chat? This will clear your entire conversation."
4. Click **"Confirm"** to reset, or **"Cancel"** to keep the conversation
5. Chat resets to the initial greeting state`,
      },
    },
  },
}

/* ================================================================== */
/* Scenario 7: Test Failed                                             */
/* ================================================================== */

const Scenario7Example = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isInputDisabled, setIsInputDisabled] = useState(false)
  const [isActionDisabled, setIsActionDisabled] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionLabel, setActionLabel] = useState("Test Integration")
  const [actionMode, setActionMode] = useState<SetupIntegrationAction>("test")
  const [title, setTitle] = useState("Configure Integration")
  const [subtitle, setSubtitle] = useState("Step 3 of 3")
  const [hasConfigured, setHasConfigured] = useState(false)
  const [testAttempts, setTestAttempts] = useState(0)

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }

  const handleSendMessage = (text: string) => {
    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: text,
    })
    setInputValue("")
    setIsInputDisabled(true)

    if (!hasConfigured) {
      // Mapping → configured
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Mapping tool.",
          variant: "status",
        })
      }, 500)

      setTimeout(() => {
        addMessage({
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `I've set up the Google Sheets '${text}' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.`,
        })
        setIsInputDisabled(false)
        setIsActionDisabled(false)
        setHasConfigured(true)
      }, 2000)
      return
    }

    // Test value submitted — handle pass/fail based on attempt count
    setTimeout(() => {
      if (testAttempts === 0) {
        // First test attempt → fail
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Invalid test value! Please try again.",
          variant: "error",
        })
        setIsInputDisabled(false)
        setTestAttempts(1)
      } else {
        // Retry → success
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Test successful! The tool call was executed correctly. You can now publish the integration.",
          variant: "success",
        })
        setIsInputDisabled(false)
        setActionLabel("Publish Integration")
        setActionMode("publish")
      }
    }, 1500)
  }

  const handleAction = () => {
    if (hasConfigured && testAttempts === 0) {
      // Start test phase
      setIsActionLoading(true)
      setIsInputDisabled(true)

      addMessage({
        id: (Date.now() + 3).toString(),
        role: "assistant",
        content:
          "Welcome to the Test Phase. Let's verify the integration before publishing.\n\nPlease provide a test value for the variable: {{row_data}}",
        statusLabel: "Running test...",
      })

      setTimeout(() => {
        setIsActionLoading(false)
        setIsInputDisabled(false)
      }, 1500)
    } else if (actionMode === "publish") {
      setOpen(false)
    }
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
      },
    ])
    setInputValue("")
    setIsInputDisabled(false)
    setIsActionDisabled(true)
    setIsActionLoading(false)
    setActionLabel("Test Integration")
    setActionMode("test")
    setTitle("Configure Integration")
    setSubtitle("Step 3 of 3")
    setHasConfigured(false)
    setTestAttempts(0)
  }

  const handleClose = () => {
    setOpen(false)
    handleResetChat()
  }

  return (
    <>
      <SetupTrigger onClick={() => setOpen(true)} />
      <SetupIntegration
        open={open}
        onOpenChange={setOpen}
        title={title}
        subtitle={subtitle}
        messages={messages}
        inputValue={inputValue}
        isInputDisabled={isInputDisabled}
        isActionDisabled={isActionDisabled}
        isActionLoading={isActionLoading}
        actionLabel={actionLabel}
        actionMode={actionMode}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onAction={handleAction}
        onResetChat={handleResetChat}
        onClose={handleClose}
        onBack={handleClose}
      />
    </>
  )
}

export const Scenario7_TestFailed: Story = {
  render: () => <Scenario7Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 7 — Test Failed**

Flow: Greeting → Configure → Test → Fail → Retry → Success → Publish

1. Click **"+ Integrations"** to open
2. Type an action (e.g., "Add Row") and press Enter
3. AI maps and configures the tool (~2s)
4. Click **"Test Integration"** — test phase begins, asks for a variable value
5. Type a test value (e.g., "data") — test fails with red error: "Invalid test value! Please try again."
6. Type another value (e.g., "value") — test succeeds with green success bubble
7. Button changes to **"Publish Integration"**`,
      },
    },
  },
}

/* ================================================================== */
/* Scenario 8: Close / Discard During Setup                            */
/* ================================================================== */

const Scenario8Example = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
    },
    {
      id: "2",
      role: "user",
      content: "Add Row",
    },
    {
      id: "3",
      role: "assistant",
      content:
        "I've set up the Google Sheets 'Add Row' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.",
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <SetupTrigger onClick={() => setOpen(true)} />
      <SetupIntegration
        open={open}
        onOpenChange={setOpen}
        title="Test Integration"
        subtitle="Step 4 of 4"
        messages={messages}
        inputValue={inputValue}
        actionLabel="Test Integration"
        actionMode="test"
        onInputChange={setInputValue}
        onClose={handleClose}
        onBack={handleClose}
        onResetChat={() => {
          setMessages([
            {
              id: "1",
              role: "assistant",
              content:
                "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
            },
          ])
        }}
      />
    </>
  )
}

export const Scenario8_CloseDiscard: Story = {
  render: () => <Scenario8Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 8 — Close / Discard During Setup**

Flow: Mid-conversation → Click Close (X) or Back (←) → Discard confirmation → Discard → Modal closes

1. Click **"+ Integrations"** to open (starts mid-conversation)
2. Click **X** (close) or **←** (back) button
3. Confirmation modal appears: "Discard integration? Are you sure you want to close this? Unsaved progress will be lost."
4. Click **"Discard"** to close, or **"Cancel"** to stay`,
      },
    },
  },
}

/* ================================================================== */
/* Scenario 9: Edit Integration                                        */
/* ================================================================== */

const editIntegrationMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi! I'll help you configure Google Sheets for your bot. Describe what you want the bot to do with Google Sheets and I'll set up the right tools and variables.",
  },
  {
    id: "2",
    role: "user",
    content: "Add Row",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "I've set up the Google Sheets 'Add Row' tool for you. You'll need to provide the Spreadsheet ID and Sheet Name once, and the bot will then ask the user for the data to be added to the columns during the conversation.",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Welcome to the Test Phase. Let's verify the integration before publishing.\n\nPlease provide a test value for the variable: {{row_data}}",
    statusLabel: "Running test...",
  },
  {
    id: "5",
    role: "user",
    content: "data",
  },
  {
    id: "6",
    role: "assistant",
    content:
      "Test successful! The tool call was executed correctly. You can now publish the integration.",
    variant: "success",
  },
]

// ---------- Static: Edit Integration view ----------
export const EditIntegration: Story = {
  render: (args) => <ModalStory {...args} />,
  args: {
    messages: editIntegrationMessages,
    title: "Edit Integration",
    subtitle: "Step 3 of 3",
    integrationName: "Integration test 1",
    onIntegrationNameChange: fn(),
    actionLabel: "Test Integration",
    isActionDisabled: false,
    actionMode: "test",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Edit mode — header shows "Edit Integration - Integration test 1" with a pencil icon. Click the pencil to rename the integration inline.',
      },
    },
  },
}

// ---------- Interactive: Scenario 9 ----------
const Scenario9Example = () => {
  const [open, setOpen] = useState(false)
  const [integrationName, setIntegrationName] = useState("Integration test 1")

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <SetupTrigger onClick={() => setOpen(true)} />
      <SetupIntegration
        open={open}
        onOpenChange={setOpen}
        title="Edit Integration"
        subtitle="Step 3 of 3"
        integrationName={integrationName}
        onIntegrationNameChange={setIntegrationName}
        messages={editIntegrationMessages}
        inputValue=""
        actionLabel="Test Integration"
        actionMode="test"
        onClose={handleClose}
        onBack={handleClose}
        onResetChat={() => {}}
      />
    </>
  )
}

export const Scenario9_EditIntegration: Story = {
  render: () => <Scenario9Example />,
  parameters: {
    docs: {
      description: {
        story: `**Scenario 9 — Edit Integration**

Flow: Open in edit mode → Click pencil icon → Rename integration → Confirm

1. Click **"+ Integrations"** to open (shows existing integration with chat history)
2. Header shows **"Edit Integration - Integration test 1"** with a ✏️ pencil icon
3. Click the pencil icon — name becomes an editable input field
4. Type a new name and click ✓ (or press Enter) to confirm
5. Press Escape to cancel the edit`,
      },
    },
  },
}

/** Same UI as the dialog, rendered as a plain panel (e.g. inside a custom modal or page). */
export const StandaloneView: StoryObj<typeof SetupIntegrationView> = {
  render: () => (
    <div className="flex h-[min(100dvh-4rem,920px)] min-h-0 w-full max-w-[min(calc(100vw-2rem),860px)] flex-col rounded-lg border border-semantic-border-layout p-3 sm:p-4">
      <SetupIntegrationView
        messages={defaultMessages}
        title="Setup Integration"
        subtitle="Step 3 of 4"
        actionLabel="Test Integration"
        isActionDisabled
        onResetChat={fn()}
        onClose={fn()}
        onBack={fn()}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Uses `SetupIntegrationView` without Radix Dialog — embed in your own modal shell or route layout.",
      },
    },
  },
}
