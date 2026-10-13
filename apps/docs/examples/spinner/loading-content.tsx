import { useState } from "react";
import { Spinner } from "@/components/ui/v2/spinner";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3" role="status">
        {loading ? (
          <>
            <Spinner aria-hidden="true" size="sm" />
            <span>Loading the team inbox</span>
          </>
        ) : (
          <span>Three conversations are ready</span>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={() => setLoading(!loading)}>
        {loading ? "Resolve local preview" : "Restart loading"}
      </Button>
    </div>
  );
}
