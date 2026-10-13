import { Panel } from "@/components/ui/v2/panel";
export default function Example() {
  return (
    <div className="flex h-80 w-full max-w-sm min-w-0">
      <Panel
        title="Contact activity"
        footer={
          <span className="text-xs text-semantic-text-muted">
            8 recent events
          </span>
        }
      >
        <ol className="m-0 space-y-5 p-5 pl-9">
          {[
            "Mira replied to the customer",
            "Owen assigned the conversation",
            "Leena updated the contact",
            "Emma added a note",
            "Marcus resolved the conversation",
            "Ava reopened the conversation",
            "Mira attached the invoice",
            "Owen sent a follow-up",
          ].map((item) => (
            <li key={item} className="text-sm text-semantic-text-secondary">
              {item}
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
