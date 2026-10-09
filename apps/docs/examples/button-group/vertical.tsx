import { ButtonGroup } from "@/components/ui/v2/button-group";

export default function Vertical() {
  return (
    <ButtonGroup
      label="View"
      orientation="vertical"
      items={[
        { id: "list", label: "List" },
        { id: "board", label: "Board" },
        { id: "calendar", label: "Calendar" },
      ]}
    />
  );
}
