import { useMemo } from "react";
import { LocalStorage } from "@/lib/storage/localStorage";
import { createMemoService } from "@/lib/services/memoService";

/**
 * メモ操作のサービス関数群を提供するカスタムフック
 */
export function useMemoService() {
  return useMemo(() => {
    const storage = new LocalStorage();
    return createMemoService(storage);
  }, []);
}
