import { Alert, AlertTitle, AlertDescription } from "@/components/ui/v2/alert";

export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-4">
      {(["inline", "header", "overlay"] as const).map((presentation) => (
        <Alert key={presentation} presentation={presentation} variant="info">
          <AlertTitle>{presentation}</AlertTitle>
          <AlertDescription>New conversations arrive here.</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
