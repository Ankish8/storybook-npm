import * as React from "react";
import { PaginationWidget } from "@/components/ui/v2/pagination";

export default function Basic() {
  const [page, setPage] = React.useState(3);
  return (
    <PaginationWidget
      currentPage={page}
      totalPages={12}
      onPageChange={setPage}
    />
  );
}
