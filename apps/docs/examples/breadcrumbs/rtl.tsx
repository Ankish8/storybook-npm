import { Breadcrumbs } from "@/components/ui/v2/breadcrumbs";

export default function RightToLeft() {
  return (
    <Breadcrumbs
      dir="rtl"
      aria-label="مسار التنقل"
      maxItems={3}
      items={[
        { label: "الرئيسية", href: "#home" },
        { label: "مساحة العمل", href: "#workspace" },
        { label: "الإعدادات", href: "#settings" },
        { label: "التكاملات" },
      ]}
    />
  );
}
