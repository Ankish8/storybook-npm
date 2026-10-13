import { useState } from "react";
import { PhoneInput } from "@/components/ui/v2/phone-input";
export default function Validation() {
  const [invalid, setInvalid] = useState(false);
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="validation-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="validation-phone"
        countrySelector
        validation={invalid ? "Check this phone number." : undefined}
      />
      <button
        type="button"
        className="text-sm text-semantic-text-link"
        onClick={() => setInvalid(!invalid)}
      >
        Toggle validation message
      </button>
      <label
        htmlFor="invalid-phone"
        className="block pt-3 text-sm font-medium text-semantic-text-primary"
      >
        ARIA invalid state
      </label>
      <PhoneInput
        id="invalid-phone"
        aria-invalid={true}
        showChevron={false}
        placeholder="Invalid field without a message"
      />
    </div>
  );
}
