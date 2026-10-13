import { useEffect, useRef } from "react";
import { Toaster, toast } from "@/components/ui/v2/toast";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const notice = useRef<ReturnType<typeof toast> | null>(null);
  useEffect(() => () => toast.dismiss(), []);
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            notice.current?.dismiss();
            notice.current = toast({
              title: "Syncing workspace",
              description: "Local preview in progress.",
              duration: Infinity,
            });
          }}
        >
          Start local sync
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const current = notice.current;
            if (current)
              current.update({
                id: current.id,
                title: "Workspace synced",
                description: "Local preview completed.",
                variant: "success",
                duration: 4000,
              });
          }}
        >
          Complete sync
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => notice.current?.dismiss()}
        >
          Cancel notice
        </Button>
      </div>
      <Toaster
        viewportProps={{
          className:
            "relative bottom-auto left-auto right-auto top-auto m-0 max-h-[none] w-full max-w-full p-0 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-full",
        }}
      />
    </div>
  );
}
