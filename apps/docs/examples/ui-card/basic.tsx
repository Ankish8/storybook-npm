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
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Shared inbox</UiCardTitle>
      </UiCardHeader>
      <UiCardContent>
        <UiCardDescription>
          Keep team conversations in one place.
        </UiCardDescription>
      </UiCardContent>
      <UiCardFooter>
        <span className="text-xs text-semantic-text-muted">Updated today</span>
      </UiCardFooter>
    </UiCard>
  );
}
