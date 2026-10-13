import { Skeleton } from "@/components/ui/v2/skeleton";

export default function Example() {
  return (
    <div
      className="grid w-full max-w-xs gap-3"
      aria-busy="true"
      aria-label="Loading contact details"
    >
      <Skeleton />
      <Skeleton width="75%" />
      <Skeleton width="45%" />
    </div>
  );
}
