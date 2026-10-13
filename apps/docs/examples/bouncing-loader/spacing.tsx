import { BouncingLoader } from "@/components/ui/v2/bouncing-loader";

export default function Example() {
  return (
    <div className="grid gap-5">
      <BouncingLoader
        size={6}
        spacing={3}
        aria-label="Compact typing indicator"
      />
      <BouncingLoader
        size={6}
        spacing={8}
        aria-label="Spaced typing indicator"
      />
      <BouncingLoader
        size="0.5rem"
        spacing="0.5rem"
        aria-label="Custom typing indicator"
      />
    </div>
  );
}
