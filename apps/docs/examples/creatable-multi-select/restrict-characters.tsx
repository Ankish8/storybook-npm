import { useId, useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

export default function RestrictCharacters() {
  const [value, setValue] = useState<string[]>([]);
  const [invalid, setInvalid] = useState(false);
  const messageId = useId();

  return (
    <div className="flex w-[420px] max-w-full flex-col gap-2">
      <CreatableMultiSelect
        aria-label="Tags"
        aria-describedby={invalid ? messageId : undefined}
        value={value}
        onValueChange={setValue}
        state={invalid ? "error" : "default"}
        placeholder="Letters and spaces only"
        sanitizeInput={(raw) => raw.replace(/[^A-Za-z ]/g, "")}
        normalizeInput={(text) => text.replace(/ +/g, " ").replace(/^ /, "")}
        onInvalidCharacters={() => setInvalid(true)}
        onValidInput={() => setInvalid(false)}
      />
      {invalid && (
        <p id={messageId} className="m-0 text-xs text-v2-semantic-error-text">
          Use letters and spaces only.
        </p>
      )}
    </div>
  );
}
