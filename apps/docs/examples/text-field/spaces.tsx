import { TextField } from "@/components/ui/v2/text-field";
export default function Spaces() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <TextField
        label="Normalized name"
        placeholder="Try pasting consecutive spaces"
        helperText="Repeated spaces collapse into one."
      />
      <TextField
        label="Exact spacing"
        preventConsecutiveSpaces={false}
        placeholder="Every space is kept"
        helperText="Useful when the original spacing matters."
      />
    </div>
  );
}
