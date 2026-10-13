import { useRef, useState } from "react";
import { PhoneInput } from "@/components/ui/v2/phone-input";
export default function ExternalPicker() {
  const [country, setCountry] = useState({ iso: "IN", code: "+91" });
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="w-full max-w-[360px] space-y-2">
      <label
        htmlFor="external-phone"
        className="text-sm font-medium text-semantic-text-primary"
      >
        Mobile number
      </label>
      <PhoneInput
        ref={input}
        id="external-phone"
        countryIso={country.iso}
        countryCode={country.code}
        onCountryClick={() => setOpen(!open)}
      />
      {open && (
        <div className="flex gap-2" aria-label="Country choices">
          {[
            { iso: "IN", code: "+91" },
            { iso: "US", code: "+1" },
            { iso: "GB", code: "+44" },
          ].map((next) => (
            <button
              key={next.iso}
              type="button"
              className="rounded-md border border-semantic-border-layout px-3 py-2 text-sm"
              onClick={() => {
                setCountry(next);
                setOpen(false);
                input.current?.focus();
              }}
            >
              {next.iso} {next.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
