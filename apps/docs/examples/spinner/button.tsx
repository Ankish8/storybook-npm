import { Spinner } from "@/components/ui/v2/spinner";

export default function Example() {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center gap-2 rounded-lg border border-semantic-border-layout bg-semantic-bg-ui px-4 py-2 text-sm text-semantic-text-secondary"
    >
      <Spinner size="sm" variant="current" aria-hidden="true" />
      Saving changes
    </button>
  );
}
