import { useState } from "react";
import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "voice", label: "Voice" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS" },
];

export default function ErrorExample() {
  const [channels, setChannels] = useState<string[]>([]);

  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Channels"
        required
        placeholder="Select channels"
        helperText="Customers can reach you on these."
        error={
          channels.length === 0 ? "Select at least one channel." : undefined
        }
        options={options}
        value={channels}
        onValueChange={setChannels}
      />
    </div>
  );
}
