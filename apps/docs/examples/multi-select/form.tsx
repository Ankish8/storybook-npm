import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "voice", label: "Voice" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS" },
];

export default function Form() {
  const [submitted, setSubmitted] = useState("");

  return (
    <form
      className="flex w-[360px] max-w-full flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(JSON.stringify(data.getAll("channels")));
      }}
    >
      <MultiSelect
        label="Channels"
        name="channels"
        placeholder="Select channels"
        options={options}
        defaultValue={["voice"]}
      />
      <Button type="submit">Save</Button>
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        {submitted ? `channels = ${submitted}` : "Nothing submitted yet."}
      </p>
    </form>
  );
}
