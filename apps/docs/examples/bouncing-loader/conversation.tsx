import { useState } from "react";
import { BouncingLoader } from "@/components/ui/v2/bouncing-loader";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [typing, setTyping] = useState(true);
  return (
    <div className="grid w-full max-w-xs gap-4">
      <div className="rounded-xl border border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-4">
        <p className="m-0 text-sm font-medium text-v2-semantic-text-primary">
          Emma Collins
        </p>
        {typing ? (
          <div className="mt-3 flex items-center gap-3">
            <BouncingLoader aria-label="Emma is typing" />
            <span className="text-xs text-v2-semantic-text-muted">Typing</span>
          </div>
        ) : (
          <p className="m-0 mt-3 text-sm text-v2-semantic-text-secondary">
            I'll review the conversation now.
          </p>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={() => setTyping(!typing)}>
        {typing ? "Add local reply" : "Restart typing"}
      </Button>
    </div>
  );
}
