import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/v2/table";
export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Table key={size} size={size} withoutBorder>
          <TableCaption>{size} density</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Inbox</TableHead>
              <TableHead>Waiting</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Support</TableCell>
              <TableCell>14</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </div>
  );
}
