import { ButtonGroup } from "@/components/ui/v2/button-group";

const items = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { id: "three", label: "Three" },
];

export default function Variants() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup label="Outline" variant="outline" items={items} />
      <ButtonGroup label="Solid" variant="solid" items={items} />
    </div>
  );
}
