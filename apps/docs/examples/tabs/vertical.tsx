import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/v2/tabs";

export default function Vertical() {
  return (
    <div className="grid w-full max-w-lg gap-6">
      {(["underline", "pill"] as const).map((variant) => (
        <Tabs
          key={variant}
          defaultValue="account"
          orientation="vertical"
          className="flex gap-4"
        >
          <TabsList
            variant={variant}
            aria-label={
              variant === "pill" ? "Pill settings" : "Underline settings"
            }
            className="w-32 shrink-0"
          >
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-0 flex-1">
            Manage your account details.
          </TabsContent>
          <TabsContent value="security" className="mt-0 flex-1">
            Update your security preferences.
          </TabsContent>
          <TabsContent value="billing" className="mt-0 flex-1">
            Review your billing details.
          </TabsContent>
        </Tabs>
      ))}
    </div>
  );
}
