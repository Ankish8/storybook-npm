import { ButtonGroup } from "@/components/ui/v2/button-group";

export default function Disabled() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup
        label="Whole group disabled"
        disabled
        items={[
          { id: "one", label: "One" },
          { id: "two", label: "Two" },
        ]}
      />
      <ButtonGroup
        label="One item disabled"
        items={[
          { id: "one", label: "One" },
          { id: "two", label: "Two", disabled: true },
          { id: "three", label: "Three" },
        ]}
      />
    </div>
  );
}
