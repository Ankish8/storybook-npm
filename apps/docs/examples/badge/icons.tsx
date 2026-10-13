import { Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/v2/badge";
export default function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge variant="active" leftIcon={<Check />}>
        Verified
      </Badge>
      <Badge variant="information" rightIcon={<ArrowUpRight />}>
        Shared
      </Badge>
      <Badge dot variant="warning">
        Pending
      </Badge>
    </div>
  );
}
