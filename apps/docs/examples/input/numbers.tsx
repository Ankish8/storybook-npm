import { Input } from "@/components/ui/v2/input";

export default function Numbers() {
  return (
    <div className="grid w-full max-w-[640px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="num-amount"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Amount
        </label>
        <Input id="num-amount" type="number" placeholder="1250.50" />
        <p className="m-0 text-xs text-[var(--v2-text-muted)]">
          Decimals are fine. The letter e is refused.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="num-seats"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Seats
        </label>
        <Input
          id="num-seats"
          type="number"
          allowDecimal={false}
          placeholder="25"
        />
        <p className="m-0 text-xs text-[var(--v2-text-muted)]">
          Whole numbers only. A decimal point is refused.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="num-delay"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Delay (seconds)
        </label>
        <Input
          id="num-delay"
          type="number"
          hideNumberSpinners={false}
          defaultValue={5}
        />
        <p className="m-0 text-xs text-[var(--v2-text-muted)]">
          The native step arrows are shown.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="num-sci"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Scientific notation
        </label>
        <Input
          id="num-sci"
          type="number"
          preventNumberExponent={false}
          placeholder="2e22"
        />
        <p className="m-0 text-xs text-[var(--v2-text-muted)]">
          Exponent notation such as 2e22 is accepted.
        </p>
      </div>
    </div>
  );
}
