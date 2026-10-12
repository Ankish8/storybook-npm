import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Disabled() {
  return (
    <div className="w-[240px] max-w-full">
      <NumberStepField
        aria-label="Delay"
        value={3}
        onValueChange={() => {}}
        min={0}
        max={23}
        suffix="hours"
        disabled
      />
    </div>
  );
}
