import { useState } from "react";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "@/components/ui/v2/toast";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider duration={5000}>
      <div className="grid w-full max-w-sm gap-4">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Open notification
        </Button>
        <Toast open={open} onOpenChange={setOpen}>
          <ToastTitle>Conversation assigned</ToastTitle>
          <ToastDescription>
            Mira will follow up with this customer.
          </ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport className="relative bottom-auto left-auto right-auto top-auto m-0 max-h-[none] w-full max-w-full p-0 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-full" />
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          {open ? "Notification open" : "Notification closed"}
        </p>
      </div>
    </ToastProvider>
  );
}
