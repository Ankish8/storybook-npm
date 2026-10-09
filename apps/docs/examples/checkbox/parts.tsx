import { Checkbox } from "@/components/ui/v2/checkbox";

export default function Parts() {
  return (
    <Checkbox defaultChecked name="terms">
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        Accept terms and conditions
      </Checkbox.Content>
      <Checkbox.Description>You can change this later.</Checkbox.Description>
    </Checkbox>
  );
}
