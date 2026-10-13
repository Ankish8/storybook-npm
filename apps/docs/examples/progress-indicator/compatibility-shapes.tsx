import { ProgressIndicator } from "@/components/ui/v2/progress-indicator";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <ProgressIndicator
        variant="circle"
        value={65}
        aria-label="Circular contact import"
      />
      <ProgressIndicator
        variant="semi-circle"
        value={65}
        aria-label="Semicircular contact import"
      />
    </div>
  );
}
