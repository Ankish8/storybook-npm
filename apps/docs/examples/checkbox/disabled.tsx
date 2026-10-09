import { Checkbox } from "@/components/ui/v2/checkbox";

export default function Disabled() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled defaultChecked label="Disabled and checked" />
      <Checkbox
        disabled
        label="Premium feature"
        description="This feature is coming soon."
      />
    </div>
  );
}
