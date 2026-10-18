import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/v2/dropdown-menu";

export default function Choices() {
  const [notifications, setNotifications] = useState(true);
  const [sort, setSort] = useState("newest");
  return (
    <div className="flex flex-col items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">View preferences</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={notifications}
            onCheckedChange={(value) => setNotifications(value === true)}
            onSelect={(event) => event.preventDefault()}
          >
            Notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort conversations</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem
              value="newest"
              onSelect={(event) => event.preventDefault()}
            >
              Newest first
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="oldest"
              onSelect={(event) => event.preventDefault()}
            >
              Oldest first
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="m-0 text-sm text-v2-semantic-text-muted" role="status">
        Notifications {notifications ? "on" : "off"} · {sort} first
      </p>
    </div>
  );
}
