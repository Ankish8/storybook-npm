import { TextField } from "@/components/ui/v2/text-field";
export default function Uncontrolled() {
  return (
    <TextField
      label="Team name"
      defaultValue="Sales"
      clearable
      maxLength={24}
      showCount
      wrapperClassName="w-full max-w-sm"
    />
  );
}
