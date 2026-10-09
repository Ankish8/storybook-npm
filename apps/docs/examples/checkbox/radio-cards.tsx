import { Radio, RadioGroup } from "@/components/ui/v2/checkbox";

export default function RadioCards() {
  return (
    <RadioGroup
      name="billing"
      aria-label="Billing"
      defaultValue="team"
      className="w-[380px] max-w-full"
    >
      <Radio
        variant="card"
        value="starter"
        label="Starter"
        description="Up to 3 agents and a shared inbox."
      />
      <Radio
        variant="card"
        value="team"
        label="Team"
        description="Unlimited agents, routing rules and reports."
      />
      <Radio
        variant="card"
        value="enterprise"
        label="Enterprise"
        description="Single sign-on and a dedicated manager."
        disabled
      />
    </RadioGroup>
  );
}
