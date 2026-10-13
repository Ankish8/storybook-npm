import { Badge } from "@/components/ui/v2/badge";

export default function Example() {
  return (
    <div className="flex max-w-md flex-wrap gap-3">
      {(
        [
          "default",
          "primary",
          "secondary",
          "outline",
          "destructive",
          "active",
          "information",
          "warning",
          "failed",
          "disabled",
        ] as const
      ).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  );
}
