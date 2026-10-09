import { ActionButton } from "@/components/ui/v2/action-button";

const send = () => new Promise((resolve) => setTimeout(resolve, 1000));

export default function KeepSuccess() {
  return (
    <ActionButton
      label="Send invite"
      successLabel="Invite sent"
      resetAfterMs={0}
      onAction={send}
    />
  );
}
