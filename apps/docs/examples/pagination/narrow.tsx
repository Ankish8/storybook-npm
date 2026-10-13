import * as React from "react";
import { PaginationWidget } from "@/components/ui/v2/pagination";

export default function Narrow() {
  const [page, setPage] = React.useState(1);
  return (
    <div className="w-full max-w-[260px]">
      <PaginationWidget
        currentPage={page}
        totalPages={20}
        pageWindow={3}
        onPageChange={setPage}
      />
    </div>
  );
}
