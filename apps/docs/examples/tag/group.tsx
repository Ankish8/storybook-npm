import { useState } from "react";
import { TagGroup } from "@/components/ui/v2/tag";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [all, setAll] = useState(false);
  const tags = [
    { label: "Inbox:", value: "Support" },
    { label: "Owner:", value: "Mira" },
    { value: "Unresolved" },
    { value: "Today" },
  ];
  return (
    <div className="grid gap-4">
      <TagGroup tags={tags} maxVisible={all ? tags.length : 2} />
      <Button size="sm" variant="outline" onClick={() => setAll(!all)}>
        {all ? "Show fewer tags" : "Show all tags"}
      </Button>
    </div>
  );
}
