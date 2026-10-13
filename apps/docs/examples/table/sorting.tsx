import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  useTableSort,
} from "@/components/ui/v2/table";
import { Button } from "@/components/ui/v2/button";
type Campaign = { id: string; name: string; contacts: number };
const data: Campaign[] = [
  { id: "renewals", name: "Renewals", contacts: 420 },
  { id: "onboarding", name: "Onboarding", contacts: 95 },
  { id: "followup", name: "Follow-up", contacts: 210 },
];
const columns = {
  name: { value: (row: Campaign) => row.name },
  contacts: { value: (row: Campaign) => row.contacts },
};
export default function Example() {
  const { rows, sortBy, resetSort, getSortDirection } = useTableSort(data, {
    columns,
  });
  return (
    <div className="grid w-full max-w-md gap-3">
      <Button size="sm" variant="outline" onClick={resetSort}>
        Reset sort
      </Button>
      <Table aria-label="Campaign contacts">
        <TableHeader>
          <TableRow>
            <TableHead
              sortDirection={getSortDirection("name")}
              onSortChange={(direction) => sortBy("name", direction)}
            >
              Campaign
            </TableHead>
            <TableHead
              sortDirection={getSortDirection("contacts")}
              onSortChange={(direction) => sortBy("contacts", direction)}
            >
              Contacts
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody animateRows>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell className="tabular-nums">{row.contacts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
