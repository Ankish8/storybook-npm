import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/v2/accordion";
export default function Example() {
  return (
    <Accordion className="w-full max-w-md">
      <AccordionItem value="available">
        <AccordionTrigger showChevron={false}>
          Available settings
        </AccordionTrigger>
        <AccordionContent>
          <p className="m-0">The chevron is hidden on this trigger.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="locked" disabled>
        <AccordionTrigger>Admin settings · locked</AccordionTrigger>
        <AccordionContent>Requires an administrator.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
