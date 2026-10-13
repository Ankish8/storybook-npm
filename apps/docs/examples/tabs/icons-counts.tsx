import { MessageSquare, UserRound, CircleCheck } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsCount,
} from "@/components/ui/v2/tabs";

export default function IconsCounts() {
  return (
    <Tabs defaultValue="open" className="w-full max-w-md">
      <TabsList aria-label="Conversation status" variant="pill">
        <TabsTrigger value="open">
          <MessageSquare size={14} aria-hidden="true" />
          Open<TabsCount aria-label="12 conversations">12</TabsCount>
        </TabsTrigger>
        <TabsTrigger value="assigned">
          <UserRound size={14} aria-hidden="true" />
          Assigned<TabsCount aria-label="8 conversations">8</TabsCount>
        </TabsTrigger>
        <TabsTrigger value="resolved">
          <CircleCheck size={14} aria-hidden="true" />
          Resolved
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open">Conversations waiting for a reply.</TabsContent>
      <TabsContent value="assigned">
        Conversations assigned to a teammate.
      </TabsContent>
      <TabsContent value="resolved">
        Conversations already resolved.
      </TabsContent>
    </Tabs>
  );
}
