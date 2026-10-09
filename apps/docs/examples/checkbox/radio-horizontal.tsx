import { Radio, RadioGroup } from "@/components/ui/v2/checkbox";

export default function RadioHorizontal() {
  return (
    <RadioGroup
      name="size"
      label="T-shirt size"
      orientation="horizontal"
      defaultValue="medium"
    >
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
  );
}
