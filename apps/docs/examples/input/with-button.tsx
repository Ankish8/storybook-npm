import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Input } from "@/components/ui/v2/input";

export default function WithButton() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState("");

  return (
    <form
      className="flex w-[440px] max-w-full flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(email);
        setEmail("");
      }}
    >
      <div className="flex gap-2">
        <Input
          type="email"
          required
          aria-label="Email"
          placeholder="name@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" className="shrink-0">
          Invite
        </Button>
      </div>
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        {sent
          ? `Invitation sent to ${sent}.`
          : "Press Enter or Invite to send."}
      </p>
    </form>
  );
}
