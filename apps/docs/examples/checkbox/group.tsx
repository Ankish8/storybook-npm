import { useState } from "react";
import { Checkbox, CheckboxGroup } from "@/components/ui/v2/checkbox";

export default function Group() {
  const [channels, setChannels] = useState(["email"]);

  return (
    <CheckboxGroup
      label="Notify me by"
      description="Choose at least one."
      value={channels}
      onValueChange={setChannels}
      error={channels.length === 0 ? "Choose at least one channel." : undefined}
    >
      <Checkbox value="email" label="Email" />
      <Checkbox value="sms" label="SMS" description="Charges may apply." />
      <Checkbox value="push" label="Push" description="Mobile app only." />
    </CheckboxGroup>
  );
}
