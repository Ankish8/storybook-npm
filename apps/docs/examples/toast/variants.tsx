import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "@/components/ui/v2/toast";
import { Check, CircleAlert, Info, TriangleAlert } from "lucide-react";
export default function Example() {
  return (
    <ToastProvider duration={Infinity}>
      {(
        [
          "default",
          "success",
          "info",
          "warning",
          "error",
          "destructive",
        ] as const
      ).map((variant) => (
        <Toast key={variant} variant={variant}>
          <div className="flex items-start gap-3">
            {variant === "success" ? (
              <Check
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-semantic-success-primary"
              />
            ) : variant === "error" || variant === "destructive" ? (
              <CircleAlert
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-semantic-error-primary"
              />
            ) : variant === "warning" ? (
              <TriangleAlert
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-semantic-warning-primary"
              />
            ) : (
              <Info
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-semantic-text-muted"
              />
            )}
            <div className="min-w-0">
              <ToastTitle>{variant}</ToastTitle>
              <ToastDescription>Review the workspace update.</ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport className="relative bottom-auto left-auto right-auto top-auto m-0 max-h-[none] w-full max-w-full p-0 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-full" />
    </ToastProvider>
  );
}
