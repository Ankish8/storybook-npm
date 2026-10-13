import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="paste-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="paste-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countrySelector
        phoneMaxNumber={10}
      />
      <p className="m-0 text-xs text-semantic-text-muted">
        Copy and paste: 98765 43210
      </p>
    </div>
  );
}
