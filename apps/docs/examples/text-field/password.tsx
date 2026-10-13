import { TextField } from "@/components/ui/v2/text-field";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
export default function Password() {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      label="Password"
      type={visible ? "text" : "password"}
      defaultValue="example-password"
      autoComplete="new-password"
      leftIcon={<Lock aria-hidden="true" />}
      rightIcon={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
          className="grid size-6 place-items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-primary"
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      }
      wrapperClassName="w-full max-w-sm"
    />
  );
}
