import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="fixed-country-phone"
        className="text-sm font-medium text-v2-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="fixed-country-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countryIso="US"
        countryCode="+1"
        showChevron={false}
      />
    </div>
  );
}
