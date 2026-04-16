import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BotTest } from "./bot-test";
import { Button } from "../../ui/button";

const sampleNumbers = [
  { value: "+91 9876543210", label: "+91 9876543210" },
  { value: "+91 8765432109", label: "+91 8765432109" },
  { value: "+91 7654321098", label: "+91 7654321098" },
];

const meta: Meta<typeof BotTest> = {
  title: "Custom/AI Bot/Bot Config/BotTest",
  component: BotTest,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `A modal dialog for testing a bot by sending a message to a selected WhatsApp number. Composes Dialog, SelectField, PhoneInput, and Button.

**Install**
\`\`\`bash
npx myoperator-ui add bot-test
\`\`\`

**Import**
\`\`\`tsx
import { BotTest } from "@/components/custom/bot-test"
\`\`\`

### Design Tokens

| Token | Purpose | Preview |
|-------|---------|---------|
| \`--semantic-text-primary\` | Title & label text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-primary);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-text-muted\` | Description text | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-text-muted);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-error-primary\` | Required asterisk | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-error-primary);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-primary\` | Test button background | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-primary);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |
| \`--semantic-border-layout\` | Input borders | <span style="display:inline-block;width:12px;height:12px;background:var(--semantic-border-layout);border:1px solid #ccc;border-radius:2px;vertical-align:middle" /> |`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Test bot
        </Button>
        <BotTest
          open={open}
          onOpenChange={setOpen}
          whatsappNumbers={sampleNumbers}
          selectedNumber={selectedNumber}
          onNumberChange={setSelectedNumber}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          onTest={() => {
            alert(
              `Testing with number: ${selectedNumber}, phone: ${phoneNumber}`
            );
          }}
        />
      </>
    );
  },
};

export const WithPrefilledValues: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState(
      "+91 9876543210"
    );
    const [phoneNumber, setPhoneNumber] = useState("9123456789");

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Test bot
        </Button>
        <BotTest
          open={open}
          onOpenChange={setOpen}
          whatsappNumbers={sampleNumbers}
          selectedNumber={selectedNumber}
          onNumberChange={setSelectedNumber}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          onTest={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Loading: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Test bot
        </Button>
        <BotTest
          open={open}
          onOpenChange={setOpen}
          whatsappNumbers={sampleNumbers}
          selectedNumber="+91 9876543210"
          phoneNumber="9123456789"
          testLoading
        />
      </>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Test bot
        </Button>
        <BotTest
          open={open}
          onOpenChange={setOpen}
          whatsappNumbers={sampleNumbers}
          selectedNumber="+91 9876543210"
          phoneNumber="9123456789"
          disabled
        />
      </>
    );
  },
};

export const CustomDescription: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Test bot
        </Button>
        <BotTest
          open={open}
          onOpenChange={setOpen}
          description="Enter a phone number to send a test message to your bot."
          whatsappNumbers={sampleNumbers}
          selectedNumber={selectedNumber}
          onNumberChange={setSelectedNumber}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          onTest={() => setOpen(false)}
        />
      </>
    );
  },
};
