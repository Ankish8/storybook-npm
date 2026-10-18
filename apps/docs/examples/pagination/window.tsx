import * as React from "react";
import { Button } from "@/components/ui/v2/button";
import { PaginationWidget } from "@/components/ui/v2/pagination";

export default function Window() {
  const [page, setPage] = React.useState(8);
  return (
    <div className="w-full max-w-lg space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="m-0 text-sm tabular-nums text-v2-semantic-text-muted">
          Page {page} of 12
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            First
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={page === 12}
            onClick={() => setPage(12)}
          >
            Last
          </Button>
        </div>
      </div>
      <PaginationWidget
        currentPage={page}
        totalPages={12}
        pageWindow={5}
        onPageChange={setPage}
      />
    </div>
  );
}
