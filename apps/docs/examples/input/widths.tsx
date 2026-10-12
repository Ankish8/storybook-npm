import { Input } from "@/components/ui/v2/input";

export default function Widths() {
  return (
    <div className="flex w-full max-w-[420px] flex-col items-start gap-4">
      {[420, 280, 160].map((width) => (
        <div
          key={width}
          className="flex max-w-full flex-col gap-2"
          style={{ width }}
        >
          <p className="m-0 text-xs text-[var(--v2-text-muted)]">
            {width}px container
          </p>
          <Input
            aria-label={`Field in a ${width}px container`}
            placeholder="Fills its container"
          />
        </div>
      ))}
    </div>
  );
}
