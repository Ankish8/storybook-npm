import { useState } from "react";
import { Textarea } from "@/components/ui/v2/textarea";
import { Button } from "@/components/ui/v2/button";
export default function Form() {
  const [saved, setSaved] = useState("");
  return (
    <form
      className="flex w-[380px] max-w-full flex-col items-start gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("notes")));
      }}
    >
      <Textarea
        wrapperClassName="w-full"
        label="Handoff notes"
        name="notes"
        required
        minLength={5}
        defaultValue="Customer requested a callback."
      />
      <Button type="submit">Save notes</Button>
      <p role="status" className="m-0 text-xs text-v2-semantic-text-muted">
        {saved ? `Saved: ${saved}` : "Nothing saved yet."}
      </p>
    </form>
  );
}
