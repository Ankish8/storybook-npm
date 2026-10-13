import { ProgressIndicator } from "@/components/ui/v2/progress-indicator";

export default function Example() {
  return (
    <ProgressIndicator
      indeterminate
      aria-label="Preparing contact import"
      className="w-full max-w-sm"
    />
  );
}
