import { Archive, Copy } from "lucide-react";
import { ButtonGroup } from "@/components/ui/v2/button-group";

export default function WithMenu() {
  return (
    <ButtonGroup
      label="Message actions"
      items={[
        { id: "reply", label: "Reply" },
        { id: "forward", label: "Forward" },
      ]}
      menu={{
        label: "More actions",
        items: [
          { id: "copy", label: "Copy link", icon: <Copy /> },
          { id: "archive", label: "Archive", icon: <Archive /> },
          { id: "delete", label: "Delete", destructive: true },
        ],
      }}
    />
  );
}
