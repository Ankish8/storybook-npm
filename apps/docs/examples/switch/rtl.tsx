import { Switch } from "@/components/ui/v2/switch";

export default function RightToLeft() {
  return (
    <div dir="rtl" className="flex flex-col items-start gap-6">
      <Switch
        label="الإشعارات"
        description="تفعيل إشعارات المحادثات الجديدة"
        defaultChecked
      />
      <Switch size="sm" label="صغير" />
      <Switch size="lg" label="كبير" defaultChecked />
    </div>
  );
}
