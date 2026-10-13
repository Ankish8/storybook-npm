import { Home, Settings } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/v2/breadcrumbs";

export default function Icons() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "#home", icon: <Home aria-hidden="true" /> },
        { label: "Workspace", href: "#workspace" },
        { label: "Settings", icon: <Settings aria-hidden="true" /> },
      ]}
    />
  );
}
