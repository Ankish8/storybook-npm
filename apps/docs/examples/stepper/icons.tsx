import * as React from "react";
import { Building2, Users, Rocket } from "lucide-react";
import { Stepper } from "@/components/ui/v2/stepper";
import { Button } from "@/components/ui/v2/button";

const steps = [
  { title: "Details", icon: <Building2 className="size-3.5" /> },
  { title: "Team", icon: <Users className="size-3.5" /> },
  { title: "Launch", icon: <Rocket className="size-3.5" /> },
];

export default function Icons() {
  const [currentStep, setCurrentStep] = React.useState(0);
  return (
    <div className="w-full max-w-lg space-y-5">
      <Stepper steps={steps} marker="icon" currentStep={currentStep} />
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
