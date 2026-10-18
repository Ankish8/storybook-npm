import * as React from "react";
import { PaginationWidget } from "@/components/ui/v2/pagination";

const contacts = Array.from(
  { length: 47 },
  (_, index) => `Contact ${String(index + 1).padStart(2, "0")}`
);

export default function Summary() {
  const [page, setPage] = React.useState(1);
  return (
    <section className="w-full space-y-4">
      <ul className="m-0 list-none p-0">
        {contacts.slice((page - 1) * 5, page * 5).map((contact) => (
          <li
            key={contact}
            className="border-b border-v2-semantic-border-layout py-2 text-sm text-v2-semantic-text-primary"
          >
            {contact}
          </li>
        ))}
      </ul>
      <PaginationWidget
        currentPage={page}
        totalPages={10}
        totalItems={47}
        pageSize={5}
        pageWindow={5}
        onPageChange={setPage}
      />
    </section>
  );
}
