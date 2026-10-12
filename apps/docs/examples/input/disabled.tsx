import { Input } from "@/components/ui/v2/input";

export default function Disabled() {
  return (
    <div className="grid w-full max-w-[640px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="disabled-field"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Disabled
        </label>
        <Input id="disabled-field" disabled defaultValue="Unavailable" />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="readonly-field"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Read-only
        </label>
        <Input
          id="readonly-field"
          readOnly
          defaultValue="support@myoperator.com"
        />
      </div>
    </div>
  );
}
