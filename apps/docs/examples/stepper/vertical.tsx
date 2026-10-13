import * as React from "react";
import { Stepper } from "@/components/ui/v2/stepper";
import { Button } from "@/components/ui/v2/button";

const steps = [
  { title: "Workspace details", description: "Choose a name and time zone." },
  {
    title: "Invite your team",
    description: "Add the people who will share this workspace.",
  },
  {
    title: "Review and launch",
    description: "Check your settings before you start.",
  },
];

export default function Vertical() {
  const [currentStep, setCurrentStep] = React.useState(1);
  return (
    <div className="w-full max-w-sm space-y-5">
      <Stepper
        steps={steps}
        orientation="vertical"
        currentStep={currentStep}
        navigation="completed"
        onStepChange={setCurrentStep}
      />
      <Button
        type="button"
        size="sm"
        onClick={() =>
          setCurrentStep(currentStep === steps.length ? 0 : currentStep + 1)
        }
      >
        {currentStep === steps.length ? "Restart" : "Continue"}
      </Button>
    </div>
  );
}
