import { Button } from "@/components/ui/v2/button";

export default function AsChild() {
  return (
    <Button asChild variant="secondary">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Open documentation
      </a>
    </Button>
  );
}
