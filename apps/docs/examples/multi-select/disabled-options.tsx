import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "voice", label: "Voice" },
  { value: "whatsapp", label: "WhatsApp" },
  {
    value: "sms",
    label: "SMS",
    disabled: true,
    disabledTooltip: "Not included in your plan.",
  },
  {
    value: "rcs",
    label: "RCS",
    disabled: true,
    disabledTooltip: "Coming soon.",
  },
];

export default function DisabledOptions() {
  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Channels"
        placeholder="Select channels"
        options={options}
      />
    </div>
  );
}
