import { useState } from "react";
import { PhoneInput } from "@/components/ui/v2/phone-input";
export default function Form() {
  const [code, setCode] = useState("+91");
  const [result, setResult] = useState("");
  return (
    <form
      className="w-full max-w-[360px] space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`${data.get("country_code")} ${data.get("phone")}`);
      }}
    >
      <label
        htmlFor="form-phone"
        className="text-sm font-medium text-v2-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="form-phone"
        countrySelector
        name="phone"
        required
        onCountryChange={(country) => setCode(country.dialCode)}
        autoComplete="tel-national"
      />
      <input type="hidden" name="country_code" value={code} />
      <button
        type="submit"
        className="rounded-md bg-v2-semantic-primary px-3 py-2 text-sm text-v2-semantic-text-inverted"
      >
        Read form value
      </button>
      <p role="status" className="m-0 text-xs text-v2-semantic-text-muted">
        {result || "Nothing submitted in this local example yet."}
      </p>
    </form>
  );
}
