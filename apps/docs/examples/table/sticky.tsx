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
    <div className="w-full max-w-lg [--v2-table-max-height:240px]">
      <Table
        stickyHeader
        className="min-w-[560px]"
        aria-label="Scrollable contact list"
      >
        <TableHeader>
          <TableRow>
            <TableHead sticky>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Inbox</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            "Mira",
            "Owen",
            "Leena",
            "Emma",
            "Marcus",
            "Ava",
            "Aditi",
            "Karan",
          ].map((name) => (
            <TableRow key={name}>
              <TableCell sticky>{name}</TableCell>
              <TableCell>{name.toLowerCase()}@example.com</TableCell>
              <TableCell>Support</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
