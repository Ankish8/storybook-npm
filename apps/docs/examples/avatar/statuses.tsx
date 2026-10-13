import { Avatar } from "@/components/ui/v2/avatar";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      {(["online", "offline", "busy", "away"] as const).map((status) => (
        <Avatar key={status} name="Emma Collins" status={status} />
      ))}
    </div>
  );
}
