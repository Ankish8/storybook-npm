import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/v2/accordion";
export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-6">
      {(["default", "bordered"] as const).map((variant) => (
        <Accordion key={variant} variant={variant}>
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
              <p className="m-0">
                The support inbox is staffed from 9am to 6pm.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
