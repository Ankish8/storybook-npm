import { useState } from "react";
import { Switch } from "@/components/ui/v2/switch";

export default function Settings() {
  const [desktop, setDesktop] = useState(true);
  const [sound, setSound] = useState(false);
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-5 rounded-xl border border-semantic-border-layout bg-semantic-bg-primary p-5">
      <p className="m-0 text-sm font-medium text-semantic-text-primary">
        Notification preferences
      </p>
      <Switch
        label="Desktop notifications"
        description="Show a banner for new conversations."
        checked={desktop}
        onCheckedChange={setDesktop}
      />
      <div className="border-t border-semantic-border-layout pt-5">
        <Switch
          label="Notification sound"
          description="Play a sound when a message arrives."
          checked={sound}
          onCheckedChange={setSound}
        />
      </div>
    </div>
  );
}
