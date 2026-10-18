import { Panel } from "@/components/ui/v2/panel";
export default function Example() {
  return (
    <div className="grid w-full max-w-lg gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex h-40 min-w-0">
          <Panel size={size} title={`${size} panel`}>
            <p className="m-0 p-4 text-sm text-v2-semantic-text-secondary">
              Contextual details stay in this panel.
            </p>
          </Panel>
        </div>
      ))}
    </div>
  );
}
