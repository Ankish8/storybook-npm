import { SplitButton } from "@/components/ui/v2/split-button";

export default function DestructiveAndDisabled() {
  return (
    <SplitButton
      label="Publish"
      actions={[
        { label: "Schedule" },
        { label: "Unpublish", disabled: true },
        { label: "Delete", destructive: true },
      ]}
    />
  );
}
