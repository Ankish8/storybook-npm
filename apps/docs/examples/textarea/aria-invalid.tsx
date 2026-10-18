import { Textarea } from "@/components/ui/v2/textarea";
export default function Invalid() {
  return (
    <div className="w-[380px] max-w-full">
      <Textarea
        label="Message"
        aria-invalid="true"
        aria-describedby="textarea-form-error"
      />
      <p
        id="textarea-form-error"
        className="m-0 pt-2 text-xs text-v2-semantic-error-text"
      >
        Add a message before continuing.
      </p>
    </div>
  );
}
