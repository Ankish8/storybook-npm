import { ButtonGroup } from "@/components/ui/v2/button-group";

const items = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { id: "three", label: "Three" },
];

export default function Sizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup label="Small" size="sm" items={items} />
      <ButtonGroup label="Default" size="default" items={items} />
      <ButtonGroup label="Large" size="lg" items={items} />
    </div>
  );
}
