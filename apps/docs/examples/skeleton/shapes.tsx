import { Skeleton } from "@/components/ui/v2/skeleton";

export default function Example() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Skeleton shape="circle" width={48} height={48} />
      <Skeleton shape="line" height={16} width="80%" />
      <Skeleton shape="rectangle" width="100%" height={120} />
    </div>
  );
}
