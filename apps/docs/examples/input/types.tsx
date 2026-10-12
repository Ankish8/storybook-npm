import { Input, type InputProps } from "@/components/ui/v2/input";

const FIELDS: {
  label: string;
  type: InputProps["type"];
  placeholder: string;
}[] = [
  { label: "Text", type: "text", placeholder: "Customer support" },
  { label: "Email", type: "email", placeholder: "name@company.com" },
  { label: "Password", type: "password", placeholder: "At least 8 characters" },
  { label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
  { label: "URL", type: "url", placeholder: "https://myoperator.com" },
  { label: "Search", type: "search", placeholder: "Search numbers" },
];

export default function Types() {
  return (
    <div className="grid w-full max-w-[640px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      {FIELDS.map((field) => (
        <div key={field.label} className="flex flex-col gap-2">
          <label
            htmlFor={`type-${field.type}`}
            className="text-sm font-medium text-[var(--v2-text-primary)]"
          >
            {field.label}
          </label>
          <Input
            id={`type-${field.type}`}
            type={field.type}
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>
  );
}
