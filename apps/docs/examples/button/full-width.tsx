import { Button } from "@/components/ui/v2/button";

export default function FullWidth() {
  return (
    <div className="flex w-[320px] max-w-full flex-col gap-3">
      <Button className="w-full">Continue</Button>
      <Button className="w-full" variant="secondary">
        Back
      </Button>
    </div>
  );
}
