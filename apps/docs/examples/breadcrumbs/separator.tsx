import { Breadcrumbs } from "@/components/ui/v2/breadcrumbs";

export default function Separator() {
  return (
    <Breadcrumbs
      separator={<span className="text-semantic-text-muted">/</span>}
      items={[
        { label: "Workspace", href: "#workspace" },
        { label: "Settings", href: "#settings" },
        { label: "Billing" },
      ]}
    />
  );
}
