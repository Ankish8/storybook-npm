import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "billing", label: "Billing" },
  { value: "routing", label: "Call routing" },
  { value: "voicemail", label: "Voicemail" },
  { value: "recording", label: "Call recording" },
  { value: "analytics", label: "Analytics" },
];

export default function Keyboard() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <MultiSelect
        label="Features"
        placeholder="Tab here, then ArrowDown"
        options={options}
        defaultValue={["billing", "routing"]}
      />
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-xs text-[var(--v2-text-muted)]">
        <li>ArrowDown / ArrowUp or Enter opens the list and moves into it</li>
        <li>ArrowUp / ArrowDown, Home and End move between rows</li>
        <li>Enter or Space picks the row; typing jumps to a matching row</li>
        <li>Escape closes and returns to the field; Tab moves on</li>
        <li>Backspace on the field drops the last pick</li>
      </ul>
    </div>
  );
}
