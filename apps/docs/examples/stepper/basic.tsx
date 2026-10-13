import * as React from "react";
import { Stepper } from "@/components/ui/v2/stepper";
import { Button } from "@/components/ui/v2/button";

const steps = [
  { title: "Details", description: "Name your workspace" },
  { title: "Team", description: "Invite your teammates" },
  { title: "Review", description: "Confirm your settings" },
];

export default function Basic() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const done = currentStep === steps.length;
  return (
    <div className="w-full max-w-lg space-y-6">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        navigation="completed"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="m-0 text-xs text-semantic-text-muted">
          {done
            ? "All steps complete"
            : `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Back
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setCurrentStep(done ? 0 : currentStep + 1)}
          >
            {done
              ? "Restart"
              : currentStep === steps.length - 1
                ? "Finish"
                : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
