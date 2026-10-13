import { Switch } from "@/components/ui/v2/switch";

export default function Disabled() {
  return (
    <div className="flex flex-col items-start gap-6">
      <Switch disabled label="Disabled off" />
      <Switch disabled defaultChecked label="Disabled on" />
      <Switch
        readOnly
        defaultChecked
        label="Managed by your team"
        description="Read-only: you can focus this setting, but only an administrator can change it."
      />
    </div>
  );
}
