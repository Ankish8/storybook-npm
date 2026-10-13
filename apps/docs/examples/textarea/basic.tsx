import { Textarea } from "@/components/ui/v2/textarea";
export default function Basic() {
  return (
    <Textarea
      wrapperClassName="w-[380px] max-w-full"
      label="Conversation notes"
      placeholder="Add useful context…"
      helperText="Share the details that matter."
    />
  );
}
