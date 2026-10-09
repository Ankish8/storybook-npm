import { SplitButton } from "@/components/ui/v2/split-button";

export default function Disabled() {
  return (
    <SplitButton disabled label="Save" actions={[{ label: "Save as draft" }]} />
  );
}
