import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { router } from "@inertiajs/react";
import { PaginationData, QueryParams } from "@/types/utils";

interface DataTablePaginationProps {
  paginationData: PaginationData;
  queryParams: QueryParams;
  routeName: string; // Route for Inertia requests
  entityId?: string | number; // Optional entity ID (e.g., project ID)
  isLoading: boolean;
}

export function DataTablePagination({
  paginationData,
  queryParams,
  routeName,
  entityId,
  isLoading,
}: DataTablePaginationProps) {
  const { meta, links } = paginationData;

  // Function to extract the page number from the URL
  const extractPageNumber = (link: string | null) => {
    if (link) {
      const urlParams = new URLSearchParams(new URL(link).search);
      return urlParams.get("page") || "1"; // Fallback to page 1 if no page param found
    }
    return null;
  };

  // Function to handle page navigation with prefetching
  const handlePageChange = (link: string | null) => {
    const page = extractPageNumber(link);
    if (page) {
      const updatedParams = { ...queryParams, page };
      if (entityId) {
        (updatedParams as { [key: string]: any }).entityId = entityId;
      }

      // Prefetch the next and previous pages
      const nextPage = parseInt(page) + 1;
      const prevPage = parseInt(page) - 1;

      if (nextPage <= meta.last_page) {
        const nextParams = { ...updatedParams, page: nextPage };
        router.prefetch(
          route(routeName, { id: entityId }),
          {
            method: "get",
            data: nextParams,
            preserveState: true,
            preserveScroll: true,
          },
          { cacheFor: "1m" },
        );
      }

      if (prevPage >= 1) {
        const prevParams = { ...updatedParams, page: prevPage };
        router.prefetch(
          route(routeName, { id: entityId }),
          {
            method: "get",
            data: prevParams,
            preserveState: true,
            preserveScroll: true,
          },
          { cacheFor: "1m" },
        );
      }

      // Perform the actual navigation
      router.get(route(routeName, { id: entityId }), updatedParams, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  // Function to handle rows per page change
  const handlePageSizeChange = (pageSize: number) => {
    const updatedParams: { [key: string]: any } = {
      ...queryParams,
      per_page: pageSize,
      page: 1,
    };
    if (entityId) updatedParams.entityId = entityId; // Include entityId if provided

    router.get(route(routeName, { id: entityId }), updatedParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <div className="flex flex-col items-center justify-between space-y-4 px-2 lg:flex-row lg:space-y-0">
      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          {meta.from} - {meta.to} of {meta.total} row(s)
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${meta.per_page}`}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${meta.per_page}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {meta.current_page} of {meta.last_page}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(links.first)}
            disabled={meta.current_page === 1 || isLoading}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(links.prev)}
            disabled={!links.prev || isLoading}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(links.next)}
            disabled={!links.next || isLoading}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(links.last)}
            disabled={meta.current_page === meta.last_page || isLoading}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
