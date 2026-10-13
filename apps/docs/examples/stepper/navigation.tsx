import * as React from "react";
import { Stepper } from "@/components/ui/v2/stepper";

const steps = [{ title: "Details" }, { title: "Team" }, { title: "Review" }];

export default function Navigation() {
  const [currentStep, setCurrentStep] = React.useState(1);
  return (
    <div className="w-full max-w-lg space-y-4">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        Step {currentStep + 1}: {steps[currentStep].title}
      </p>
    </div>
  );
}
