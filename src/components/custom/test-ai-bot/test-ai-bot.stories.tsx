import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TestAIBot } from "./test-ai-bot";
import { Button } from "../../ui/button";

/** Demo QR (SVG) — replace with your generated QR image URL in production */
const demoQrSrc =
  "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";

/** Opens the modal; matches the primary “Test on WhatsApp web” CTA (dark surface, inverted text). */
function OpenTestAIBotButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="default" size="lg" onClick={onClick}>
      Test on WhatsApp web
    </Button>
  );
}

const meta: Meta<typeof TestAIBot> = {
  title: "Custom/AI Bot/Bot Config/TestAIBot",
  component: TestAIBot,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Modal to test an AI bot: QR code on the left, title, description, and primary action on the right. Composes the shared Dialog and Button primitives with project semantic tokens (same stack as BotTest and other custom modals).

**Install**
\`\`\`bash
npx myoperator-ui add test-ai-bot
\`\`\`

**Import**
\`\`\`tsx
import { TestAIBot } from "@/components/custom/test-ai-bot"
\`\`\``,
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

    return (
      <>
        <OpenTestAIBotButton onClick={() => setOpen(true)} />
        <TestAIBot
          open={open}
          onOpenChange={setOpen}
          title="Test your AI bot"
          description="Scan the QR code to start testing, or click the button to begin."
          qrSrc={demoQrSrc}
          buttonLabel="Test on WhatsApp web"
          buttonProps={{
            onClick: () => {
              window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
            },
          }}
        />
      </>
    );
  },
};

export const LoadingButton: Story = {
  name: "Button loading",
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <OpenTestAIBotButton onClick={() => setOpen(true)} />
        <TestAIBot
          open={open}
          onOpenChange={setOpen}
          title="Test your AI bot"
          description="Scan the QR code to start testing, or click the button to begin."
          qrSrc={demoQrSrc}
          buttonLabel="Opening…"
          buttonProps={{ loading: true }}
        />
      </>
    );
  },
};

export const CustomButtonProps: Story = {
  name: "Custom button (outline, sm)",
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <OpenTestAIBotButton onClick={() => setOpen(true)} />
        <TestAIBot
          open={open}
          onOpenChange={setOpen}
          title="Test your AI bot"
          description="Use buttonProps for variant, size, icons, and loading."
          qrSrc={demoQrSrc}
          buttonLabel="Secondary action"
          buttonProps={{ variant: "outline", size: "sm" }}
        />
      </>
    );
  },
};
