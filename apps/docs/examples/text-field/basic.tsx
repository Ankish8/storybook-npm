import { TextField } from "@/components/ui/v2/text-field";
export default function Basic() {
  return (
    <TextField
      label="Workspace name"
      placeholder="Enter a workspace name"
      helperText="A name your team can recognize."
      wrapperClassName="w-full max-w-sm"
    />
  );
}
