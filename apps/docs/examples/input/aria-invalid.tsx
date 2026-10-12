import { Input } from "@/components/ui/v2/input";

export default function AriaInvalid() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-2">
      <Input
        aria-label="Phone number"
        aria-invalid="true"
        aria-describedby="aria-invalid-message"
        defaultValue="98765"
      />
      <p
        id="aria-invalid-message"
        className="m-0 text-xs text-semantic-error-text"
      >
        Enter all 10 digits.
      </p>
    </div>
  );
}
