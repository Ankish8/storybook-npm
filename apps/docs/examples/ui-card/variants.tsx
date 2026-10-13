import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
} from "@/components/ui/v2/ui-card";
export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {(["default", "template", "icon", "action", "metrics"] as const).map(
        (variant) => (
          <UiCard key={variant} variant={variant} className="w-full">
            <UiCardHeader>
              <UiCardTitle>{variant}</UiCardTitle>
            </UiCardHeader>
            <UiCardDescription>
              {variant === "metrics"
                ? "The existing metrics card remains supported."
                : "Compose the content that suits your screen."}
            </UiCardDescription>
          </UiCard>
        )
      )}
    </div>
  );
}
