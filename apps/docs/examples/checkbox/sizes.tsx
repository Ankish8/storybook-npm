import { Checkbox } from "@/components/ui/v2/checkbox";

export default function Sizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Checkbox size="sm" defaultChecked label="Small (16px)" />
      <Checkbox size="default" defaultChecked label="Default (18px)" />
      <Checkbox size="lg" defaultChecked label="Large (24px)" />
    </div>
  );
}
