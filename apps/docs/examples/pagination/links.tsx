import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/v2/pagination";

export default function Links() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled href="#page-previous" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#page-2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
