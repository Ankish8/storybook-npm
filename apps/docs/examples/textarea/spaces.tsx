import { Textarea } from "@/components/ui/v2/textarea";
export default function Spaces() {
  return (
    <Textarea
      wrapperClassName="w-[380px] max-w-full"
      label="Structured notes"
      defaultValue={"Customer   context\nNext\tstep"}
      showCount
      maxLength={120}
      helperText="Try entering extra spaces in the middle of a line."
    />
  );
}
