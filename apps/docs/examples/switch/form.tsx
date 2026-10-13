import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Switch } from "@/components/ui/v2/switch";

export default function Form() {
  const [submitted, setSubmitted] = useState("");
  return (
    <form
      className="flex max-w-full flex-col items-start gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(
          [...data.entries()]
            .map(([key, value]) => `${key}=${value}`)
            .join(", ") || "No settings enabled."
        );
      }}
    >
      <Switch
        name="desktop"
        value="enabled"
        defaultChecked
        label="Desktop alerts"
      />
      <Switch name="sound" label="Notification sound" />
      <Switch
        name="managed"
        value="enabled"
        defaultChecked
        readOnly
        label="Managed setting"
      />
      <Switch
        name="disabled"
        defaultChecked
        disabled
        label="Unavailable setting"
      />
      <Button type="submit">Read form values</Button>
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {submitted || "Nothing submitted yet."}
      </p>
    </form>
  );
}
