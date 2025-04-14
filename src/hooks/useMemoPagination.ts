import { useState, useMemo } from "react";
import { Memo } from "@/types/memo";

interface UseMemoPaginationProps {
  items: Memo[];
  itemsPerPage: number;
}

export function useMemoPagination({
  items,
  itemsPerPage,
}: UseMemoPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / itemsPerPage)),
    [items.length, itemsPerPage]
  );

  // ページが範囲外になった場合に調整
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const targetPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(targetPage);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
  };
}
