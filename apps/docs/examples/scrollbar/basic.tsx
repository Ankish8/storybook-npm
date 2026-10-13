import { Scrollbar } from "@/components/ui/v2/scrollbar";
export default function Example() {
  return (
    <Scrollbar
      aria-label="Contact activity"
      className="h-48 w-full max-w-sm rounded-lg border border-semantic-border-layout"
    >
      <ol className="m-0 space-y-4 py-4 pl-9 pr-6">
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
    </Scrollbar>
  );
}
