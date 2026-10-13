import { Textarea } from "@/components/ui/v2/textarea";
export default function Resize() {
  return (
    <Textarea
      wrapperClassName="w-[380px] max-w-full"
      label="Detailed notes"
      rows={5}
      resize="vertical"
      helperText="Drag the bottom corner to adjust the height."
    />
  );
}
