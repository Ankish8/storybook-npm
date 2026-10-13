import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/v2/select";
export default function Form() {
  const [submitted, setSubmitted] = useState("");
  return (
    <form
      className="flex w-[360px] max-w-full flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(String(data.get("authentication")));
      }}
    >
      <label
        htmlFor="form-select"
        className="text-sm font-medium text-[var(--v2-text-primary)]"
      >
        Authentication
      </label>
      <Select name="authentication" required defaultValue="basic">
        <SelectTrigger id="form-select">
          <SelectValue placeholder="Choose a method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic Auth</SelectItem>
          <SelectItem value="bearer">Bearer Token</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" size="sm">
        Read form value
      </Button>
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        {submitted ? `authentication=${submitted}` : "Nothing submitted yet."}
      </p>
    </form>
  );
}
