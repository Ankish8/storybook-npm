import * as React from "react";
import { Check, Copy, X } from "lucide-react";

import { cn } from "../../../../lib/utils";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import type { CallJourneyJsonModalProps } from "./types";

const COPIED_RESET_MS = 2000;

/**
 * CallJourneyJsonModal shows the raw JSON payload behind a call's detailed
 * logs, opened from CallDetailPanel's "View Detailed Logs" action. It's a
 * simple read-only viewer with a copy-to-clipboard button — the parent owns
 * what JSON is shown.
 *
 * @example
 * ```tsx
 * <CallJourneyJsonModal
 *   open={isJsonModalOpen}
 *   onOpenChange={setIsJsonModalOpen}
 *   json={JSON.stringify(callJourneyLog, null, 2)}
 * />
 * ```
 */
const CallJourneyJsonModal = React.forwardRef(
  (
    { open, onOpenChange, title = "JSON", json, onCopy, className }: CallJourneyJsonModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [copied, setCopied] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(json);
        setCopied(true);
        onCopy?.(json);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
      } catch {
        // Clipboard access denied/unavailable — nothing to recover from here.
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} hideCloseButton className={cn("gap-8", className)}>
          <DialogHeader className="flex-row items-center justify-between space-y-0">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied" : "Copy JSON"}
                className={cn(
                  "rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-text-primary",
                  copied
                    ? "text-semantic-success-primary"
                    : "text-semantic-text-muted hover:text-semantic-text-primary"
                )}
              >
                {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
              </button>
              <DialogClose
                aria-label="Close"
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              >
                <X className="size-4" />
              </DialogClose>
            </div>
          </DialogHeader>
          <pre className="m-0 max-h-[420px] w-full overflow-y-auto whitespace-pre-wrap break-words rounded bg-[var(--color-neutral-50)] p-5 font-mono text-xs leading-[18px] text-semantic-text-secondary">
            {json}
          </pre>
        </DialogContent>
      </Dialog>
    );
  }
);
CallJourneyJsonModal.displayName = "CallJourneyJsonModal";

export { CallJourneyJsonModal };
