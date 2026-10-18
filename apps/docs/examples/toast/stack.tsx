import { useEffect, useState } from "react";
import { Toaster, toast } from "@/components/ui/v2/toast";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => () => toast.dismiss(), []);
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            for (const title of [
              "Workspace saved",
              "Conversation assigned",
              "Webhook retried",
              "Contact updated",
              "Report ready",
            ])
              toast({
                title,
                description:
                  "Review the update, its owner and next step alongside earlier changes, then dismiss it when you are done.",
                duration: Infinity,
              });
          }}
        >
          Queue five notices
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </div>
      <label className="flex items-center gap-2 text-xs text-v2-semantic-text-secondary">
        <input
          type="checkbox"
          checked={expanded}
          onChange={(event) => setExpanded(event.target.checked)}
        />
        Keep expanded
      </label>
      <Toaster
        stack
        visibleToasts={3}
        expanded={expanded}
        onExpandedChange={setExpanded}
        viewportProps={{
          className:
            "relative bottom-auto left-auto right-auto top-auto m-0 max-h-[none] w-full max-w-full p-0 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-full",
        }}
      />
    </div>
  );
}
