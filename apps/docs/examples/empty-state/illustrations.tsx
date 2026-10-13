import { EmptyState } from "@/components/ui/v2/empty-state";

export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-4">
      {(["no-results", "offline", "caught-up", "not-found"] as const).map(
        (illustration) => (
          <EmptyState
            key={illustration}
            illustration={illustration}
            title={illustration}
            description="Use an explanation suited to this state."
            size="sm"
          />
        )
      )}
    </div>
  );
}
