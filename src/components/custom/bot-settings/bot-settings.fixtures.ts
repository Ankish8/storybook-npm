import type {
  MultiSelectGroupedSection,
  MultiSelectOption,
} from "../../ui/multi-select";

/** Demo data aligned with WABA “Connect WhatsApp” / Figma-style rows */
export const demoWhatsappOptions: MultiSelectOption[] = [
  {
    value: "wa-1",
    label: "+91 9876543210",
    secondaryText: "Assigned to Bot Name 1",
  },
  {
    value: "wa-2",
    label: "+91 6543120931",
    secondaryText: "Assigned to Bot Name 1",
  },
  {
    value: "wa-3",
    label: "+91 6543165437",
    secondaryText: "Assigned to Bot Name 1",
  },
  { value: "wa-4", label: "+91 1111222233" },
  { value: "wa-5", label: "+91 2222333344" },
  {
    value: "wa-6",
    label: "+91 7653443219",
    disabled: true,
    disabledTooltip: "This number is associated with another bot.",
  },
];

/**
 * Grouped list — pass as `whatsappOptions` and set `whatsappSeparateSelectedWithDivider={false}`
 * so section headers render ([Figma 42590-146154](https://www.figma.com/design/oAmONXSK6KvWaBMf8mmYvM/WABA-of-My-Operator---Phase-1?node-id=42590-146154)).
 */
export const whatsappGroupedSections: readonly MultiSelectGroupedSection[] = [
  {
    label: "OPTION LABEL 1",
    options: [
      {
        value: "g1",
        label: "+91 9876543210",
        secondaryText: "Assigned to Bot Name 1",
      },
      {
        value: "g2",
        label: "+91 6543120931",
        secondaryText: "Assigned to Bot Name 1",
      },
      {
        value: "g3",
        label: "+91 6543165437",
        secondaryText: "Assigned to Bot Name 1",
      },
      {
        value: "g4",
        label: "+91 1111222233",
        secondaryText: "Assigned to Bot Name 1",
      },
    ],
  },
  {
    label: "OPTION LABEL 2",
    options: [
      { value: "g5", label: "+91 7653443219" },
    ],
  },
];
