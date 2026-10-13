import { Home } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/v2/breadcrumbs";

export default function LongLabels() {
  return (
    <div className="w-full max-w-[340px] min-w-0">
      <Breadcrumbs
        maxItemWidth={112}
        items={[
          {
            label: "Customer success workspace",
            href: "#workspace",
            icon: <Home aria-hidden="true" />,
          },
          { label: "Team configuration and permissions", href: "#settings" },
          { label: "Notification delivery preferences" },
        ]}
      />
    </div>
  );
}
