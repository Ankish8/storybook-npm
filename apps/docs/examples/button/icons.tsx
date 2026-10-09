import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/v2/button";

export default function WithIcons() {
  return (
    <>
      <Button leftIcon={<Download />}>Download</Button>
      <Button variant="secondary" rightIcon={<ArrowRight />}>
        Continue
      </Button>
      <Button
        variant="outline"
        leftIcon={<Download />}
        rightIcon={<ArrowRight />}
      >
        Both
      </Button>
    </>
  );
}
