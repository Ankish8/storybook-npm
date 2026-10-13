import { TextField } from "@/components/ui/v2/text-field";
export default function Sizes() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <TextField label="Default" placeholder="44px field" />
      <TextField label="Compact" size="sm" placeholder="36px field" />
    </div>
  );
}
