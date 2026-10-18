import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Breadcrumbs } from "@/components/ui/v2/breadcrumbs";

const path = [
  { label: "Workspace", href: "#workspace" },
  { label: "Settings", href: "#settings" },
  { label: "Integrations", href: "#integrations" },
  { label: "Webhooks", href: "#webhooks" },
];

export default function Navigation() {
  const [depth, setDepth] = useState(2);
  return (
    <div className="w-full max-w-md space-y-5">
      <Breadcrumbs
        items={path.slice(0, depth)}
        maxItems={3}
        onNavigate={(_item, index, event) => {
          event.preventDefault();
          setDepth(index + 1);
        }}
      />
      <p className="m-0 text-sm text-v2-semantic-text-muted" role="status">
        Current page: {path[depth - 1].label}
      </p>
      <Button
        variant="secondary"
        size="sm"
        disabled={depth === path.length}
        onClick={() => setDepth(depth + 1)}
      >
        Open next level
      </Button>
    </div>
  );
}
