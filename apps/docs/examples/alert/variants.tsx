import { Alert, AlertTitle, AlertDescription } from "@/components/ui/v2/alert";

export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-3">
      {(
        [
          "default",
          "success",
          "error",
          "warning",
          "info",
          "destructive",
        ] as const
      ).map((variant) => (
        <Alert key={variant} variant={variant}>
          <AlertTitle>{variant}</AlertTitle>
          <AlertDescription>Changes are shared with the team.</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
