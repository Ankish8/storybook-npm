import { TextField } from "@/components/ui/v2/text-field";
import { Mail } from "lucide-react";
export default function Icons() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <TextField
        label="Work email"
        type="email"
        leftIcon={<Mail aria-hidden="true" />}
        placeholder="you@example.com"
      />
      <TextField
        label="Workspace address"
        prefix="https://"
        suffix=".myoperator.com"
        defaultValue="support"
      />
    </div>
  );
}
