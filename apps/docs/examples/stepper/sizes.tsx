import { Stepper } from "@/components/ui/v2/stepper";

const steps = [{ title: "Details" }, { title: "Team" }, { title: "Review" }];

export default function Sizes() {
  return (
    <div className="w-full max-w-lg space-y-8">
      <section className="space-y-3">
        <p className="m-0 text-xs text-v2-semantic-text-muted">
          Small · 24px marker
        </p>
        <Stepper steps={steps} size="sm" currentStep={1} />
      </section>
      <section className="space-y-3">
        <p className="m-0 text-xs text-v2-semantic-text-muted">
          Medium · 28px marker
        </p>
        <Stepper steps={steps} size="md" currentStep={1} />
      </section>
    </div>
  );
}
