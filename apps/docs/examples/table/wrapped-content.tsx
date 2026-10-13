import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/v2/table";
export default function Example() {
  return (
    <div className="w-full max-w-md">
      <Table wrapContent aria-label="Conversation summaries">
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Latest message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Mira Shah</TableCell>
            <TableCell>
              Please send the updated invoice to the billing team before the end
              of the business day.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
