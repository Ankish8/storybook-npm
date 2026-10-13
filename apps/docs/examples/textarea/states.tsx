import { Textarea } from "@/components/ui/v2/textarea";
export default function States() {
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5">
      <Textarea
        label="Disabled notes"
        disabled
        defaultValue="These notes are unavailable."
      />
      <Textarea
        label="Read-only notes"
        readOnly
        defaultValue="You can select and copy these notes."
      />
    </div>
  );
}
