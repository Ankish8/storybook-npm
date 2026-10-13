import { useEffect } from "react";
import { Toaster, toast } from "@/components/ui/v2/toast";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  useEffect(() => () => toast.dismiss(), []);
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Button
        size="sm"
        onClick={() =>
          toast.success({
            title: "Workspace saved",
            description: "The team can see the local changes.",
          })
        }
      >
        Show confirmation
      </Button>
      <Toaster
        viewportProps={{
          className:
            "relative bottom-auto left-auto right-auto top-auto m-0 max-h-[none] w-full max-w-full p-0 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-full",
        }}
      />
    </div>
  );
}
