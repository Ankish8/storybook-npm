import { ActionButton } from "@/components/ui/v2/action-button";

const publish = () => new Promise((resolve) => setTimeout(resolve, 1200));

export default function Labels() {
  return (
    <ActionButton
      label="Publish"
      pendingLabel="Publishing…"
      successLabel="Published"
      onAction={publish}
    />
  );
}
