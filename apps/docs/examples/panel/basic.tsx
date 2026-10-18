import { Panel } from "@/components/ui/v2/panel";
export default function Example() {
  return (
    <div className="flex h-72 w-full max-w-sm min-w-0">
      <Panel title="Contact details">
        <div className="space-y-3 p-4">
          <p className="m-0 text-sm font-medium text-v2-semantic-text-primary">
            Aditi Kumar
          </p>
          <p className="m-0 text-sm text-v2-semantic-text-secondary">
            aditi@example.com
          </p>
          <p className="m-0 text-sm text-v2-semantic-text-muted">
            Assigned to the support inbox.
          </p>
        </div>
      </Panel>
    </div>
  );
}
