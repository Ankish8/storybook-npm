import { Avatar } from "@/components/ui/v2/avatar";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {(["soft", "outline", "filled"] as const).map((variant) => (
        <Avatar key={variant} variant={variant} name="Emma Collins" />
      ))}
    </div>
  );
}
