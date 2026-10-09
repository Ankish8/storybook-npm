import { Checkbox } from "@/components/ui/v2/checkbox";

export default function Card() {
  return (
    <div className="w-[360px] max-w-full">
      <Checkbox
        variant="card"
        label="Email notifications"
        description="Get notified when someone mentions you in a comment."
        defaultChecked
      />
    </div>
  );
}
