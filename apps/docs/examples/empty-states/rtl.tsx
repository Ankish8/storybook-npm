import { EmptyStates } from "@/components/ui/v2/empty-states";

export default function Example() {
  return (
    <EmptyStates
      dir="rtl"
      size="sm"
      defaultValue="offline"
      tabListLabel="حالات مساحة العمل"
      states={{
        offline: {
          title: "أنت غير متصل",
          description: "تحقق من اتصالك ثم حاول مرة أخرى.",
        },
      }}
    />
  );
}
