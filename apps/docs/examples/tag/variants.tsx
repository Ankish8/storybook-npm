import { Tag } from "@/components/ui/v2/tag";

export default function Example() {
  return (
    <div className="flex max-w-md flex-wrap gap-3">
      {(
        [
          "default",
          "primary",
          "accent",
          "secondary",
          "success",
          "warning",
          "error",
          "destructive",
          "info",
        ] as const
      ).map((variant) => (
        <Tag key={variant} variant={variant}>
          {variant}
        </Tag>
      ))}
    </div>
  );
}
