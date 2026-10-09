import { Radio, RadioGroup } from "@/components/ui/v2/checkbox";

export default function RadioAnatomy() {
  return (
    <RadioGroup name="billing" label="Billing" defaultValue="yearly">
      <Radio value="monthly">
        <Radio.Content>
          <Radio.Control />
          Monthly
        </Radio.Content>
        <Radio.Description>Cancel any time.</Radio.Description>
      </Radio>
      <Radio value="yearly">
        <Radio.Content>
          <Radio.Control />
          Yearly
        </Radio.Content>
        <Radio.Description>Two months free.</Radio.Description>
      </Radio>
    </RadioGroup>
  );
}
