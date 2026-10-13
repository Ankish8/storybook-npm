import { Cloud } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/v2/alert";
export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Alert icon={<Cloud />}>
        <AlertTitle>Cloud sync available</AlertTitle>
      </Alert>
      <Alert icon={null}>
        <AlertTitle>Without an icon</AlertTitle>
      </Alert>
      <Alert showIcon={false}>
        <AlertTitle>Icon hidden by a prop</AlertTitle>
      </Alert>
    </div>
  );
}
