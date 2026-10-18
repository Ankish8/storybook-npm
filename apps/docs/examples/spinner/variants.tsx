import { Spinner } from "@/components/ui/v2/spinner";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Spinner variant="default" aria-label="Default loading" />
      <Spinner variant="secondary" aria-label="Secondary loading" />
      <Spinner variant="muted" aria-label="Muted loading" />
      <div className="rounded-lg bg-v2-semantic-primary p-3">
        <Spinner variant="inverted" aria-label="Inverted loading" />
      </div>
      <div className="text-v2-semantic-success-primary">
        <Spinner variant="current" aria-label="Inherited loading" />
      </div>
    </div>
  );
}
