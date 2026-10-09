import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
} from "@/components/ui/v2/checkbox";

export default function Form() {
  const [submitted, setSubmitted] = useState("");

  return (
    <form
      className="flex w-[320px] max-w-full flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(
          [...data.entries()]
            .map(([key, value]) => `${key}=${value}`)
            .join(", ")
        );
      }}
    >
      <CheckboxGroup
        label="Notify me by"
        name="channels"
        defaultValue={["email"]}
      >
        <Checkbox value="email" label="Email" />
        <Checkbox value="sms" label="SMS" />
      </CheckboxGroup>
      <RadioGroup label="Frequency" name="frequency" defaultValue="weekly">
        <Radio value="daily" label="Daily" />
        <Radio value="weekly" label="Weekly" />
      </RadioGroup>
      <Button type="submit">Save</Button>
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        {submitted || "Nothing submitted yet."}
      </p>
    </form>
  );
}
