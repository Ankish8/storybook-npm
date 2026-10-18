import { useState } from "react";
import { Input } from "@/components/ui/v2/input";

export default function ErrorExample() {
  const [value, setValue] = useState("not-an-email");
  const invalid = value.length > 0 && !/^\S+@\S+\.\S+$/.test(value);

  return (
    <div className="flex w-[360px] max-w-full flex-col gap-2">
      <label
        htmlFor="error-email"
        className="text-sm font-medium text-[var(--v2-text-primary)]"
      >
        Email
      </label>
      <Input
        id="error-email"
        type="email"
        state={invalid ? "error" : "default"}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "error-email-message" : undefined}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {invalid && (
        <p
          id="error-email-message"
          role="alert"
          className="m-0 text-xs text-v2-semantic-error-text"
        >
          Enter a valid email address.
        </p>
      )}
    </div>
  );
}
