import { ActionButton } from "@/components/ui/v2/action-button";

const run = () => new Promise((resolve) => setTimeout(resolve, 1000));

export default function Variants() {
  return (
    <>
      <ActionButton label="Primary" variant="primary" onAction={run} />
      <ActionButton label="Secondary" variant="secondary" onAction={run} />
      <ActionButton label="Ghost" variant="ghost" onAction={run} />
    </>
  );
}
