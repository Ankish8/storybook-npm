import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="keyboard-phone"
        className="text-sm font-medium text-v2-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="keyboard-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countrySelector
      />
      <p className="m-0 text-xs text-v2-semantic-text-muted">
        Tab to the country button, then press ArrowDown.
      </p>
    </div>
  );
}
