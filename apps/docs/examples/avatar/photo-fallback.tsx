import { useState } from "react";
import { Avatar } from "@/components/ui/v2/avatar";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [photo, setPhoto] = useState<
    "emma" | "marcus" | "missing" | "initials"
  >("emma");
  const name = photo === "marcus" ? "Marcus Johnson" : "Emma Collins";
  const src =
    photo === "initials"
      ? undefined
      : photo === "missing"
        ? "/preview/missing-avatar.jpg"
        : `https://uiarc.dev/media/people/${photo === "emma" ? "emma-collins" : "marcus-johnson"}.jpg`;
  return (
    <div className="grid max-w-sm gap-4">
      <Avatar name={name} src={src} size="xl" />
      <div className="flex flex-wrap gap-2">
        {(["emma", "marcus", "missing", "initials"] as const).map((mode) => (
          <Button
            key={mode}
            size="sm"
            variant="outline"
            onClick={() => setPhoto(mode)}
          >
            {mode}
          </Button>
        ))}
      </div>
    </div>
  );
}
