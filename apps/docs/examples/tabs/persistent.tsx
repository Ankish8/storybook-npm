import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/v2/tabs";

export default function Persistent() {
  return (
    <Tabs defaultValue="draft" className="w-full max-w-md">
      <TabsList variant="pill" aria-label="Draft settings">
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="help">Help</TabsTrigger>
      </TabsList>
      <TabsContent
        value="draft"
        forceMount
        className="data-[state=inactive]:hidden"
      >
        <label className="grid gap-2 text-sm">
          Draft title
          <input
            defaultValue="My project"
            className="rounded-md border border-v2-semantic-border-input bg-v2-semantic-bg-primary px-3 py-2 text-v2-semantic-text-primary"
          />
        </label>
      </TabsContent>
      <TabsContent
        value="help"
        forceMount
        className="data-[state=inactive]:hidden"
      >
        Edit the title, switch tabs, then return. Your unsaved title stays
        intact.
      </TabsContent>
    </Tabs>
  );
}
