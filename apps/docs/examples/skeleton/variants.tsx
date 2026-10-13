import { Skeleton } from "@/components/ui/v2/skeleton";

export default function Example() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Skeleton variant="default" height={20} />
      <Skeleton variant="subtle" height="1.25rem" />
    </div>
  );
}
