import { EmptyState } from "@/components/ui/v2/empty-state";

export default function Example() {
  return (
    <EmptyState
      illustration="caught-up"
      size="sm"
      title="You're all caught up"
      description="New conversations will appear when they arrive."
      role="status"
    />
  );
}
