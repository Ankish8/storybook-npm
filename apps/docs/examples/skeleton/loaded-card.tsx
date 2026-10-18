import { useState } from "react";
import { Skeleton } from "@/components/ui/v2/skeleton";
import { Avatar } from "@/components/ui/v2/avatar";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="grid w-full max-w-xs gap-4">
      <div
        aria-busy={loading}
        aria-label="Assigned contact"
        className="flex min-h-24 items-center gap-4 rounded-xl border border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-4"
      >
        {loading ? (
          <>
            <Skeleton shape="circle" width={40} height={40} />
            <div className="grid flex-1 gap-3">
              <Skeleton width="75%" />
              <Skeleton width="55%" />
            </div>
          </>
        ) : (
          <>
            <Avatar name="Emma Collins" />
            <div>
              <p className="m-0 text-sm font-medium text-v2-semantic-text-primary">
                Emma Collins
              </p>
              <p className="m-0 mt-1 text-xs text-v2-semantic-text-muted">
                Support specialist
              </p>
            </div>
          </>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={() => setLoading(!loading)}>
        {loading ? "Show loaded contact" : "Restart loading"}
      </Button>
    </div>
  );
}
