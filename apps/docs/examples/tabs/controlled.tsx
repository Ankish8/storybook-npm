import * as React from "react";
import { Button } from "@/components/ui/v2/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/v2/tabs";

export default function Controlled() {
  const [value, setValue] = React.useState("overview");
  return (
    <div className="grid w-full max-w-md gap-4">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList variant="pill" aria-label="Project views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">A summary of your project.</TabsContent>
        <TabsContent value="activity">
          Recent updates from your teammates.
        </TabsContent>
        <TabsContent value="settings">Manage project preferences.</TabsContent>
      </Tabs>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue("settings")}
        >
          Open settings
        </Button>
        <output className="text-xs text-semantic-text-muted">
          Selected: {value}
        </output>
      </div>
    </div>
  );
}
