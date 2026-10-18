import {
  UiCard,
  UiCardHeader,
  UiCardTitle,
  UiCardDescription,
  UiCardContent,
  UiCardFooter,
} from "@/components/ui/v2/ui-card";
export default function Example() {
  return (
    <UiCard variant="metrics">
      <UiCardHeader>
        <UiCardTitle>Resolved today</UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <p className="m-0 text-3xl font-medium text-v2-semantic-text-primary">
          128
        </p>
        <UiCardDescription>Across the support inbox.</UiCardDescription>
      </UiCardContent>
      <UiCardFooter>
        <span className="text-xs text-v2-semantic-success-text">
          12 more than yesterday
        </span>
      </UiCardFooter>
    </UiCard>
  );
}
