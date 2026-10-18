import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/v2/table";
export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  const names = ["Mira", "Owen", "Leena"];
  return (
    <div className="grid w-full max-w-md gap-3">
      <Table aria-label="Selectable contacts">
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {names.map((name) => (
            <TableRow
              key={name}
              data-state={selected.includes(name) ? "selected" : undefined}
            >
              <TableCell>
                <input
                  type="checkbox"
                  aria-label={`Select ${name}`}
                  checked={selected.includes(name)}
                  onChange={(event) =>
                    setSelected(
                      event.target.checked
                        ? [...selected, name]
                        : selected.filter((value) => value !== name)
                    )
                  }
                />
              </TableCell>
              <TableCell>{name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p role="status" className="m-0 text-xs text-v2-semantic-text-muted">
        {selected.length} contacts selected
      </p>
    </div>
  );
}
