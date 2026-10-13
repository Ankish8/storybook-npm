import { Breadcrumbs } from "@/components/ui/v2/breadcrumbs";

export default function Collapsed() {
  return (
    <Breadcrumbs
      maxItems={3}
      items={[
        { label: "Home", href: "#home" },
        { label: "Workspace", href: "#workspace" },
        { label: "Settings", href: "#settings" },
        { label: "Integrations", href: "#integrations" },
        { label: "Webhooks" },
      ]}
    />
  );
}
