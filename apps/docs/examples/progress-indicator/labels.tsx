import { ProgressIndicator } from "@/components/ui/v2/progress-indicator";

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      {(["right", "bottom", "none"] as const).map((labelPosition) => (
        <ProgressIndicator
          key={labelPosition}
          value={65}
          labelPosition={labelPosition}
          aria-label={`Contact import, ${labelPosition} label`}
          className="w-full"
        />
      ))}
    </div>
  );
}
