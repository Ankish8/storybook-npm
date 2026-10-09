import { Checkbox, CheckboxGroup } from "@/components/ui/v2/checkbox";

export default function GroupCards() {
  return (
    <CheckboxGroup
      label="Add-ons"
      defaultValue={["support"]}
      className="w-[380px] max-w-full"
    >
      <Checkbox
        variant="card"
        value="support"
        label="Priority support"
        description="Replies within one business hour."
      />
      <Checkbox
        variant="card"
        value="reports"
        label="Weekly reports"
        description="A summary of your team's activity."
      />
      <Checkbox
        variant="card"
        value="sso"
        label="Single sign-on"
        description="Available on the Enterprise plan."
        disabled
      />
    </CheckboxGroup>
  );
}
