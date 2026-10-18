import { Scrollbar } from "@/components/ui/v2/scrollbar";
export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {(["subtle", "dark"] as const).map((variant) => (
        <Scrollbar
          key={variant}
          variant={variant}
          aria-label={`${variant} activity list`}
          className="h-40 rounded-lg border border-v2-semantic-border-layout"
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
              <li key={item} className="text-sm">
                {item}
              </li>
            ))}
          </ol>
        </Scrollbar>
      ))}
    </div>
  );
}
