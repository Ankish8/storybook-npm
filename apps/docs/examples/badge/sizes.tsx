import { Badge } from "@/components/ui/v2/badge";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Badge key={size} size={size}>
          {size}
        </Badge>
      ))}
    </div>
  );
}
