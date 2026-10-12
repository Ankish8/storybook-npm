import { Input } from "@/components/ui/v2/input";

export default function WithLabel() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-2">
      <label
        htmlFor="work-email"
        className="text-sm font-medium text-[var(--v2-text-primary)]"
      >
        Work email
      </label>
      <Input
        id="work-email"
        type="email"
        placeholder="name@company.com"
        aria-describedby="work-email-help"
      />
      <p
        id="work-email-help"
        className="m-0 text-xs text-[var(--v2-text-muted)]"
      >
        We only use this for receipts.
      </p>
    </div>
  );
}
