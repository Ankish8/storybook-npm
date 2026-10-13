import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/v2/accordion";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [open, setOpen] = useState<string[]>(["contacts"]);
  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpen(["contacts", "hours"])}
        >
          Expand all
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen([])}>
          Close all
        </Button>
      </div>
      <Accordion value={open} onValueChange={setOpen}>
        <AccordionItem value="contacts">
          <AccordionTrigger>Contact assignment</AccordionTrigger>
          <AccordionContent>
            <p className="m-0">
              Assign conversations to a teammate from the inbox.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hours">
          <AccordionTrigger>Business hours</AccordionTrigger>
          <AccordionContent>
            <p className="m-0">The support inbox is staffed from 9am to 6pm.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="m-0 text-xs text-semantic-text-muted" role="status">
        {open.length} sections open
      </p>
    </div>
  );
}
