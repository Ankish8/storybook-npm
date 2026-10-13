import { Switch } from "@/components/ui/v2/switch";

export default function Sizes() {
  return (
    <div className="flex flex-col items-start gap-6">
      <Switch size="sm" label="Small" defaultChecked />
      <Switch label="Default" defaultChecked />
      <Switch size="lg" label="Large" defaultChecked />
    </div>
  );
}
