import { Scrollbar } from "@/components/ui/v2/scrollbar";
export default function Example() {
  return (
    <Scrollbar
      orientation="horizontal"
      aria-label="Team inboxes"
      className="h-36 w-full max-w-sm rounded-lg border border-semantic-border-layout"
    >
      <div className="flex w-max gap-3 p-4">
        {["Support", "Sales", "Billing", "Onboarding", "Retention"].map(
          (name) => (
            <div
              key={name}
              className="w-36 shrink-0 rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-4 text-sm text-semantic-text-secondary"
            >
              {name} inbox
            </div>
          )
        )}
      </div>
    </Scrollbar>
  );
}
