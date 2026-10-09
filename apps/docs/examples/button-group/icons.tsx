import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { ButtonGroup } from "@/components/ui/v2/button-group";

export default function IconsOnly() {
  return (
    <ButtonGroup
      label="Alignment"
      variant="toggle"
      iconOnly
      defaultValue="left"
      items={[
        { value: "left", label: "Align left", icon: <AlignLeft /> },
        { value: "center", label: "Align centre", icon: <AlignCenter /> },
        { value: "right", label: "Align right", icon: <AlignRight /> },
      ]}
    />
  );
}
