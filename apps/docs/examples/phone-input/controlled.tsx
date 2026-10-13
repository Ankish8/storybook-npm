import { useState } from "react";
import { PhoneInput } from "@/components/ui/v2/phone-input";
export default function Controlled() {
  const [country, setCountry] = useState("IN");
  const [number, setNumber] = useState("");
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="controlled-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        id="controlled-phone"
        countrySelector
        countryIso={country}
        onCountryChange={(next) => setCountry(next.iso)}
        value={number}
        onChange={(event) => setNumber(event.target.value)}
        autoComplete="tel-national"
      />
      <p className="m-0 text-xs text-semantic-text-muted">
        {country} · {number || "No number yet"}
      </p>
      <button
        type="button"
        className="text-sm text-semantic-text-link"
        onClick={() => {
          setCountry("GB");
          setNumber("");
        }}
      >
        Reset to United Kingdom
      </button>
    </div>
  );
}
