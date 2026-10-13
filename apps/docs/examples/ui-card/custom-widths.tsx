import {
  UiCard,
  UiCardTitle,
  UiCardDescription,
} from "@/components/ui/v2/ui-card";
export default function Example() {
  return (
    <div className="grid w-full max-w-lg gap-4">
      <UiCard className="w-full">
        <UiCardTitle>Full available width</UiCardTitle>
        <UiCardDescription>A responsive content card.</UiCardDescription>
      </UiCard>
      <UiCard className="w-full max-w-xs">
        <UiCardTitle>Compact width</UiCardTitle>
        <UiCardDescription>Useful in a narrow column.</UiCardDescription>
      </UiCard>
    </div>
  );
}
