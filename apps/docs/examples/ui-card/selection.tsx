import { useState } from "react";
import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
} from "@/components/ui/v2/ui-card";
export default function Example() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="grid max-w-sm gap-3">
      <UiCard selected={selected} onClick={() => setSelected(!selected)}>
        <UiCardHeader>
          <UiCardTitle>Support inbox</UiCardTitle>
        </UiCardHeader>
        <UiCardDescription>
          Press Enter, Space or click to toggle.
        </UiCardDescription>
      </UiCard>
      <UiCard disabled onClick={() => setSelected(false)}>
        <UiCardTitle>Archived inbox</UiCardTitle>
      </UiCard>
      <p role="status" className="m-0 text-xs text-v2-semantic-text-muted">
        {selected ? "Support inbox selected" : "No inbox selected"}
      </p>
    </div>
  );
}
