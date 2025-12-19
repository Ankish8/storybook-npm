import { Toaster as SonnerToaster, toast } from "sonner";

import { cn } from "@/lib/utils";

/**
 * Position options for the toast container.
 */
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Props for the Toaster component.
 */
export interface ToasterProps {
  /** Position of the toast container (default: "bottom-right") */
  position?: ToastPosition;
  /** Whether to show the close button on toasts (default: true) */
  closeButton?: boolean;
  /** Duration in milliseconds before toast auto-dismisses (default: 4000) */
  duration?: number;
  /** Gap between toasts in pixels (default: 8) */
  gap?: number;
  /** Offset from the edge of the screen in pixels (default: 16) */
  offset?: number | string;
  /** Whether to expand toasts on hover (default: true) */
  expand?: boolean;
  /** Whether toasts are visually stacked (default: true) */
  visibleToasts?: number;
  /** Custom class name for the toaster container */
  className?: string;
  /** Rich colors mode - uses more vibrant background colors */
  richColors?: boolean;
}

/**
 * Toast container component that renders toast notifications.
 * Place this component once at the root of your app (e.g., in App.tsx or layout).
 *
 * @example
 * ```tsx
 * // In your App.tsx or layout
 * import { Toaster } from "@/components/ui/toast"
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   )
 * }
 * ```
 */
function Toaster({
  position = "bottom-right",
  closeButton = true,
  duration = 4000,
  gap = 8,
  offset = 16,
  expand = true,
  visibleToasts = 3,
  className,
  richColors = true,
  ...props
}: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      closeButton={closeButton}
      duration={duration}
      gap={gap}
      offset={offset}
      expand={expand}
      visibleToasts={visibleToasts}
      richColors={richColors}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast",
            "group-[.toaster]:bg-white group-[.toaster]:text-[#181D27]",
            "group-[.toaster]:border group-[.toaster]:border-[#E9EAEB]",
            "group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
            "group-[.toaster]:p-4"
          ),
          title: "group-[.toast]:font-semibold group-[.toast]:text-[#181D27]",
          description: "group-[.toast]:text-sm group-[.toast]:text-[#717680]",
          actionButton: cn(
            "group-[.toast]:bg-[#4275D6] group-[.toast]:text-white",
            "group-[.toast]:rounded group-[.toast]:px-3 group-[.toast]:py-1.5",
            "group-[.toast]:text-sm group-[.toast]:font-medium"
          ),
          cancelButton: cn(
            "group-[.toast]:bg-[#F5F5F5] group-[.toast]:text-[#181D27]",
            "group-[.toast]:rounded group-[.toast]:px-3 group-[.toast]:py-1.5",
            "group-[.toast]:text-sm group-[.toast]:font-medium"
          ),
          closeButton: cn(
            "group-[.toast]:text-[#717680]",
            "group-[.toast]:hover:text-[#181D27]",
            "group-[.toast]:border-[#E9EAEB]",
            "group-[.toast]:bg-white"
          ),
          // Variant-specific styles (when richColors is true)
          success: cn(
            "group-[.toaster]:bg-[#ECFDF3] group-[.toaster]:border-[#17B26A]/20",
            "group-[.toaster]:text-[#067647]",
            "[&_[data-icon]]:text-[#17B26A]"
          ),
          error: cn(
            "group-[.toaster]:bg-[#FEF3F2] group-[.toaster]:border-[#F04438]/20",
            "group-[.toaster]:text-[#B42318]",
            "[&_[data-icon]]:text-[#F04438]"
          ),
          warning: cn(
            "group-[.toaster]:bg-[#FFFAEB] group-[.toaster]:border-[#F79009]/20",
            "group-[.toaster]:text-[#B54708]",
            "[&_[data-icon]]:text-[#F79009]"
          ),
          info: cn(
            "group-[.toaster]:bg-[#EBF5FF] group-[.toaster]:border-[#4275D6]/20",
            "group-[.toaster]:text-[#1849A9]",
            "[&_[data-icon]]:text-[#4275D6]"
          ),
        },
      }}
      {...props}
    />
  );
}

// Re-export toast function with our custom types
export { Toaster, toast };

/**
 * Convenience functions for common toast types.
 *
 * @example
 * ```tsx
 * import { toast } from "@/components/ui/toast"
 *
 * // Simple message
 * toast("Event has been created")
 *
 * // With description
 * toast.success("Success!", {
 *   description: "Your changes have been saved."
 * })
 *
 * // Error toast
 * toast.error("Error", {
 *   description: "Something went wrong. Please try again."
 * })
 *
 * // With action button
 * toast("Event created", {
 *   action: {
 *     label: "Undo",
 *     onClick: () => console.log("Undo clicked")
 *   }
 * })
 *
 * // Promise toast (shows loading, then success/error)
 * toast.promise(saveData(), {
 *   loading: "Saving...",
 *   success: "Saved successfully!",
 *   error: "Failed to save"
 * })
 *
 * // Dismiss a specific toast
 * const toastId = toast("Message")
 * toast.dismiss(toastId)
 *
 * // Dismiss all toasts
 * toast.dismiss()
 * ```
 */
