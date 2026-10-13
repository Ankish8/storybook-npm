import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="digit-limit-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="digit-limit-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countrySelector
        phoneMaxNumber={6}
      />
      <p className="m-0 text-xs text-semantic-text-muted">
        Enter up to six digits in this example.
      </p>
    </div>
  );
}
