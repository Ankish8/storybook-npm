import { Radio, RadioGroup } from "@/components/ui/v2/checkbox";

export default function RadioGroupExample() {
  return (
    <RadioGroup
      name="plan"
      label="Plan"
      description="Choose the plan that suits you best."
      defaultValue="premium"
    >
      <Radio
        value="basic"
        label="Basic"
        description="100 messages per month."
      />
      <Radio
        value="premium"
        label="Premium"
        description="200 messages per month."
      />
      <Radio
        value="business"
        label="Business"
        description="Unlimited messages."
      />
    </RadioGroup>
  );
}
