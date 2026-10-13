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
          toast({
            title: "Swipe left to dismiss",
            description: "This local notice inherits a three-second duration.",
            duration: 0,
          })
        }
      >
        Show three-second notice
      </Button>
      <Toaster
        providerProps={{
          duration: 3000,
          swipeDirection: "left",
          swipeThreshold: 50,
        }}
        viewportProps={{
          className:
            "relative bottom-auto left-auto right-auto top-auto m-0 max-h-[none] w-full max-w-full p-0 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-full",
        }}
      />
    </div>
  );
}
