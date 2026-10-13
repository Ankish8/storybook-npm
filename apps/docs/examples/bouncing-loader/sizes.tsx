import { BouncingLoader } from "@/components/ui/v2/bouncing-loader";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <BouncingLoader size={4} aria-label="Small typing indicator" />
      <BouncingLoader size={6} aria-label="Default typing indicator" />
      <BouncingLoader size="0.5rem" aria-label="Large typing indicator" />
    </div>
  );
}
