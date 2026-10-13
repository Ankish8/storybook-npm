import * as React from "react";
import { Stepper } from "@/components/ui/v2/stepper";
import { Button } from "@/components/ui/v2/button";

export default function RightToLeft() {
  const [currentStep, setCurrentStep] = React.useState(0);
  return (
    <div dir="rtl" className="w-full max-w-lg space-y-5">
      <Stepper
        steps={[
          { title: "التفاصيل" },
          { title: "الفريق" },
          { title: "المراجعة" },
        ]}
        currentStep={currentStep}
        navigation="completed"
        onStepChange={setCurrentStep}
      />
      <Button
        type="button"
        size="sm"
        onClick={() => setCurrentStep(currentStep === 3 ? 0 : currentStep + 1)}
      >
        {currentStep === 3 ? "إعادة البدء" : "متابعة"}
      </Button>
    </div>
  );
}
