import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="basic-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="basic-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countrySelector
      />
    </div>
  );
}
