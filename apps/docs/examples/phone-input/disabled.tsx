import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="disabled-phone"
        className="text-sm font-medium text-v2-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="disabled-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countrySelector
        disabled
        defaultValue="9876543210"
      />
    </div>
  );
}
