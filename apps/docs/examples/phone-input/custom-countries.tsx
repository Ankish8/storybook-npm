import { PhoneInput } from "@/components/ui/v2/phone-input";

export default function Example() {
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="custom-countries-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="custom-countries-phone"
        autoComplete="tel-national"
        placeholder="Enter phone number"
        countrySelector
        countries={[
          { iso: "IN", name: "India", dialCode: "+91" },
          { iso: "GB", name: "United Kingdom", dialCode: "+44" },
          { iso: "US", name: "United States", dialCode: "+1" },
        ]}
      />
    </div>
  );
}
