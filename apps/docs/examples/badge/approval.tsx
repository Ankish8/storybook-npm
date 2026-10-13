import { useState } from "react";
import { Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/v2/badge";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [approved, setApproved] = useState(false);
  return (
    <div className="grid gap-4">
      <div role="status">
        <Badge
          variant={approved ? "active" : "warning"}
          leftIcon={approved ? <Check /> : <Clock />}
        >
          {approved ? "Approved for release" : "Awaiting review"}
        </Badge>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setApproved(!approved)}
      >
        {approved ? "Reopen review" : "Approve changes"}
      </Button>
    </div>
  );
}
