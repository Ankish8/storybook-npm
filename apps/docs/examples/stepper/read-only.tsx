import { Stepper } from "@/components/ui/v2/stepper";

export default function ReadOnly() {
  return (
    <Stepper
      className="w-full max-w-lg"
      steps={[
        { title: "Submitted" },
        { title: "In review" },
        { title: "Approved" },
      ]}
      currentStep={1}
      aria-label="Approval progress"
    />
  );
}
