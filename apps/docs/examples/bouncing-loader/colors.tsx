import { BouncingLoader } from "@/components/ui/v2/bouncing-loader";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <BouncingLoader
        color="var(--v2-semantic-text-placeholder,var(--semantic-text-placeholder))"
        aria-label="Muted loading"
      />
      <BouncingLoader
        color="var(--v2-semantic-info-primary,var(--semantic-info-primary))"
        aria-label="Information loading"
      />
      <BouncingLoader
        color="var(--v2-semantic-success-primary,var(--semantic-success-primary))"
        aria-label="Success loading"
      />
    </div>
  );
}
