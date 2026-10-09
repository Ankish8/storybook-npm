import { Button } from "@/components/ui/v2/button";

export default function Disabled() {
  return (
    <>
      <Button disabled>Primary</Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
    </>
  );
}
