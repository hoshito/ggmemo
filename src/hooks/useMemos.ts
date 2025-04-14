import { useState, useEffect } from "react";
import { Memo, MemoFormData } from "@/types/memo";
import { useMemoPagination } from "./useMemoPagination";
import { useMemoService } from "./useMemoService";

const MEMOS_PER_PAGE = 5;

export function useMemos() {
  const memoService = useMemoService();
  const [memos, setMemos] = useState<Memo[]>([]);

  // メモの初期読み込み
  useEffect(() => {
    const loadMemos = async () => {
      try {
        const loadedMemos = await memoService.getMemos();
        setMemos(loadedMemos);
      } catch (error) {
        console.error("Failed to load memos:", error);
      }
    };

    loadMemos();
  }, [memoService]);

  // ページネーション
  const {
    currentPage,
    totalPages,
    currentItems: currentPageMemos,
    goToPage: setCurrentPage,
  } = useMemoPagination({
    items: memos,
    itemsPerPage: MEMOS_PER_PAGE,
  });

  // メモの追加
  const addMemo = async (data: MemoFormData) => {
    try {
      const newMemo = await memoService.addMemo(data);
      setMemos((prev) => [newMemo, ...prev]);
    } catch (error) {
      console.error("Failed to add memo:", error);
      throw error;
    }
  };

  // メモの更新
  const updateMemo = async (id: string, data: MemoFormData) => {
    try {
      await memoService.updateMemo(id, data);
      setMemos((prev) =>
        prev.map((memo) =>
          memo.id === id ? { ...data, id, createdAt: memo.createdAt } : memo
        )
      );
    } catch (error) {
      console.error("Failed to update memo:", error);
      throw error;
    }
  };

  // メモの削除
  const deleteMemo = async (id: string) => {
    try {
      await memoService.deleteMemo(id);
      setMemos((prev) => prev.filter((memo) => memo.id !== id));
    } catch (error) {
      console.error("Failed to delete memo:", error);
      throw error;
    }
  };

  // すべてのメモを削除
  const deleteAllMemos = async () => {
    try {
      await memoService.deleteAllMemos();
      setMemos([]);
    } catch (error) {
      console.error("Failed to delete all memos:", error);
      throw error;
    }
  };

  return {
    memos,
    totalMemos: memos.length,
    currentPage,
    currentPageMemos,
    totalPages,
    addMemo,
    updateMemo,
    deleteMemo,
    deleteAllMemos,
    setCurrentPage,
  };
}
