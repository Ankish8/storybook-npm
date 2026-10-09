import { Checkbox } from "@/components/ui/v2/checkbox";

export default function LabelPosition() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Checkbox label="Label on the right (default)" labelPosition="right" />
      <Checkbox label="Label on the left" labelPosition="left" />
    </div>
  );
}
