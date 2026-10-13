import { Switch } from "@/components/ui/v2/switch";

export default function Description() {
  return (
    <div className="max-w-[340px]">
      <Switch
        label="Desktop notifications"
        description="Show an alert when a new conversation is assigned to you."
        defaultChecked
      />
    </div>
  );
}
