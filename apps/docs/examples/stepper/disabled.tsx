import * as React from "react";
import { Stepper } from "@/components/ui/v2/stepper";

export default function Disabled() {
  const [currentStep, setCurrentStep] = React.useState(0);
  return (
    <div className="w-full max-w-lg space-y-8">
      <section className="space-y-3">
        <p className="m-0 text-xs text-semantic-text-muted">
          One unavailable step
        </p>
        <Stepper
          steps={[
            { title: "Details" },
            { title: "Team", disabled: true },
            { title: "Review" },
          ]}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
      </section>
      <section className="space-y-3">
        <p className="m-0 text-xs text-semantic-text-muted">
          All step actions disabled
        </p>
        <Stepper
          steps={[{ title: "Details" }, { title: "Team" }, { title: "Review" }]}
          currentStep={1}
          onStepChange={setCurrentStep}
          disabled
        />
      </section>
    </div>
  );
}
