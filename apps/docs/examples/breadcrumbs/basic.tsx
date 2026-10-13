import { Breadcrumbs } from "@/components/ui/v2/breadcrumbs";

export default function Basic() {
  return (
    <Breadcrumbs
      items={[
        { label: "Workspace", href: "#workspace" },
        { label: "Settings", href: "#settings" },
        { label: "Billing" },
      ]}
    />
  );
}
