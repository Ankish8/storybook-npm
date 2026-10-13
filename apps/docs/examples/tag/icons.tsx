import { Phone } from "lucide-react";
import { Tag } from "@/components/ui/v2/tag";
export default function Example() {
  return (
    <Tag label="Channel:">
      <Phone className="size-3.5" aria-hidden="true" />
      Voice call
    </Tag>
  );
}
