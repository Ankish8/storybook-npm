import { EmptyState } from "@/components/ui/v2/empty-state";

export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-4">
      {(["default", "sm"] as const).map((size) => (
        <EmptyState
          key={size}
          size={size}
          illustration="caught-up"
          title={size === "sm" ? "Compact view" : "Full view"}
          description="The same title, description and action slots."
        />
      ))}
    </div>
  );
}
