import { Archive, Copy, Send } from "lucide-react";
import { SplitButton } from "@/components/ui/v2/split-button";

export default function WithIcons() {
  return (
    <SplitButton
      label="Send"
      icon={<Send />}
      actions={[
        { label: "Duplicate", icon: <Copy /> },
        { label: "Archive", icon: <Archive /> },
      ]}
    />
  );
}
