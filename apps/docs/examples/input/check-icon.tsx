import { Input } from "@/components/ui/v2/input";

export default function CheckIcon() {
  return (
    <div className="w-[360px] max-w-full">
      <Input showCheckIcon aria-label="Amount" placeholder="Click to focus" />
    </div>
  );
}
