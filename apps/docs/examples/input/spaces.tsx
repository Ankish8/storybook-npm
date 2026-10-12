import { Input } from "@/components/ui/v2/input";

export default function Spaces() {
  return (
    <div className="grid w-full max-w-[640px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="spaces-on"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Default
        </label>
        <Input id="spaces-on" defaultValue="Rhea from XYZ" />
        <p className="m-0 text-xs text-[var(--v2-text-muted)]">
          A second space in a row is ignored and the caret stays put.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="spaces-off"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Keep every space
        </label>
        <Input
          id="spaces-off"
          preventConsecutiveSpaces={false}
          defaultValue="Rhea from XYZ"
        />
        <p className="m-0 text-xs text-[var(--v2-text-muted)]">
          Spaces are kept as typed.
        </p>
      </div>
    </div>
  );
}
