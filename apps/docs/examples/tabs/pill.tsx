import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/v2/tabs";

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="pill" aria-label="Project views">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        A summary of your project and recent progress.
      </TabsContent>
      <TabsContent value="activity">
        Recent updates from your teammates.
      </TabsContent>
      <TabsContent value="settings">
        Manage your project preferences.
      </TabsContent>
    </Tabs>
  );
}
