import { Switch } from "@/components/ui/v2/switch";

export default function LabelPosition() {
  return (
    <div className="flex flex-col items-start gap-6">
      <Switch label="Label on the right" defaultChecked />
      <Switch label="Label on the left" labelPosition="left" defaultChecked />
    </div>
  );
}
