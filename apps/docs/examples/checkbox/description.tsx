import { Checkbox } from "@/components/ui/v2/checkbox";

export default function WithDescription() {
  return (
    <Checkbox
      label="Email notifications"
      description="Get notified when someone mentions you in a comment."
    />
  );
}
