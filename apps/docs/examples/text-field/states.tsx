import { TextField } from "@/components/ui/v2/text-field";
export default function States() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <TextField label="Disabled" defaultValue="Unavailable" disabled />
      <TextField
        label="Read-only"
        defaultValue="WS-1048"
        readOnly
        helperText="This identifier can be copied."
      />
      <TextField
        label="Loading"
        defaultValue="Checking workspace…"
        loading
        helperText="Typing is paused while this field is loading."
      />
    </div>
  );
}
