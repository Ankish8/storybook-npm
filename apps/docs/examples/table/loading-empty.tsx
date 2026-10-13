import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/v2/table";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [state, setState] = useState<"loading" | "empty" | "ready">("loading");
  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="flex flex-wrap gap-2">
        {(["loading", "empty", "ready"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant="outline"
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Table aria-label="Inbox loading example">
        <TableHeader>
          <TableRow>
            <TableHead>Inbox</TableHead>
            <TableHead>Waiting</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          isLoading={state === "loading"}
          loadingRows={3}
          loadingColumns={2}
        >
          {state === "empty" ? (
            <TableEmpty colSpan={2}>
              No conversations match the filter.
            </TableEmpty>
          ) : (
            <TableRow>
              <TableCell>Support</TableCell>
              <TableCell>14</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
