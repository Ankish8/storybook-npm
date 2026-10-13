import { Avatar } from "@/components/ui/v2/avatar";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size} name="Emma Collins" />
      ))}
    </div>
  );
}
