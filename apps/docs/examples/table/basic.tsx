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
    <div className="w-full max-w-md">
      <Table>
        <TableCaption>Inbox activity today</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Inbox</TableHead>
            <TableHead scope="col">Resolved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Support</TableCell>
            <TableCell>128</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sales</TableCell>
            <TableCell>42</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
