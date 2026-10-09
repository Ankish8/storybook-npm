import { ActionButton } from "@/components/ui/v2/action-button";

const run = () => new Promise((resolve) => setTimeout(resolve, 1000));

export default function Sizes() {
  return (
    <>
      <ActionButton label="Small" size="sm" onAction={run} />
      <ActionButton label="Default" size="default" onAction={run} />
      <ActionButton label="Large" size="lg" onAction={run} />
    </>
  );
}
