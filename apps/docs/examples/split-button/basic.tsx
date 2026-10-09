import { SplitButton } from "@/components/ui/v2/split-button";

export default function Basic() {
  return (
    <SplitButton
      label="Save"
      onClick={() => console.log("Saved")}
      actions={[
        { label: "Save as draft" },
        { label: "Save and publish" },
        { label: "Save as template" },
      ]}
    />
  );
}
