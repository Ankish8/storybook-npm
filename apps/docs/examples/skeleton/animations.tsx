import { Skeleton } from "@/components/ui/v2/skeleton";

export default function Example() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      {(["pulse", "shimmer", "none"] as const).map((animation) => (
        <div key={animation} className="grid gap-2">
          <span className="text-xs text-semantic-text-muted">{animation}</span>
          <Skeleton animation={animation} height={24} />
        </div>
      ))}
    </div>
  );
}
