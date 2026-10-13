import * as React from "react";
import { PaginationWidget } from "@/components/ui/v2/pagination";

export default function RightToLeft() {
  const [page, setPage] = React.useState(8);
  return (
    <div dir="rtl" className="w-full">
      <PaginationWidget
        currentPage={page}
        totalPages={12}
        pageWindow={5}
        onPageChange={setPage}
      />
    </div>
  );
}
