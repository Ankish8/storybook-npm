import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Input } from "@/components/ui/v2/input";

export default function Form() {
  const [submitted, setSubmitted] = useState("");

  return (
    <form
      className="flex w-[360px] max-w-full flex-col gap-4"
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
      <div className="flex flex-col gap-2">
        <label
          htmlFor="form-name"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Workspace name
        </label>
        <Input
          id="form-name"
          name="workspace"
          required
          defaultValue="Support"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="form-seats"
          className="text-sm font-medium text-[var(--v2-text-primary)]"
        >
          Seats
        </label>
        <Input
          id="form-seats"
          name="seats"
          type="number"
          allowDecimal={false}
          min={1}
          defaultValue={5}
        />
      </div>
      <Button type="submit">Save</Button>
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        {submitted || "Nothing submitted yet."}
      </p>
    </form>
  );
}
