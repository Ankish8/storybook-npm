import { SplitButton } from "@/components/ui/v2/split-button";

const actions = [{ label: "Duplicate" }, { label: "Archive" }];

export default function Variants() {
  return (
    <>
      <SplitButton label="Primary" variant="primary" actions={actions} />
      <SplitButton label="Secondary" variant="secondary" actions={actions} />
    </>
  );
}
