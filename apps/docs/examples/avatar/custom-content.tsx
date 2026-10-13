import { User } from "lucide-react";
import { Avatar } from "@/components/ui/v2/avatar";
export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <Avatar name="Support team" initials="ST" />
      <Avatar aria-label="Unassigned contact" variant="outline">
        <User className="size-5" aria-hidden="true" />
      </Avatar>
    </div>
  );
}
