import { Tag } from "@/components/ui/v2/tag";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Tag key={size} size={size}>
          {size}
        </Tag>
      ))}
    </div>
  );
}
