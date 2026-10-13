import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="read-only-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="read-only-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countrySelector
        readOnly
        defaultValue="9876543210"
      />
    </div>
  );
}
