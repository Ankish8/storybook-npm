import { ButtonGroup } from "@/components/ui/v2/button-group";

export default function Basic() {
  return (
    <ButtonGroup
      label="Text actions"
      items={[
        { id: "copy", label: "Copy" },
        { id: "paste", label: "Paste" },
        { id: "cut", label: "Cut" },
      ]}
    />
  );
}
