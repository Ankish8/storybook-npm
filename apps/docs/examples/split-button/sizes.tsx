import { SplitButton } from "@/components/ui/v2/split-button";

const actions = [{ label: "Duplicate" }, { label: "Archive" }];

export default function Sizes() {
  return (
    <>
      <SplitButton label="Small" size="sm" actions={actions} />
      <SplitButton label="Default" size="default" actions={actions} />
      <SplitButton label="Large" size="lg" actions={actions} />
    </>
  );
}
