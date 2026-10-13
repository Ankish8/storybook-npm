import { useState } from "react";
import { Avatar, AvatarGroup } from "@/components/ui/v2/avatar";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [all, setAll] = useState(false);
  return (
    <div className="grid gap-4">
      <AvatarGroup
        max={all ? 6 : 2}
        size="md"
        aria-label="Assigned support team"
      >
        <Avatar
          name="Emma Collins"
          src="https://uiarc.dev/media/people/emma-collins.jpg"
        />
        <Avatar
          name="Marcus Johnson"
          src="https://uiarc.dev/media/people/marcus-johnson.jpg"
        />
        <Avatar
          name="Ava Mitchell"
          src="https://uiarc.dev/media/people/ava-mitchell.jpg"
        />
        <Avatar name="Mira Shah" />
        <Avatar name="Owen Lee" />
        <Avatar name="Leena Rao" />
      </AvatarGroup>
      <Button size="sm" variant="outline" onClick={() => setAll(!all)}>
        {all ? "Show fewer people" : "Show all people"}
      </Button>
    </div>
  );
}
