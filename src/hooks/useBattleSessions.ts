import { useEffect } from "react";
import { BattleSession } from "@/types/battleSession";
import { Memo } from "@/types/memo";
import { useBattleSessionState } from "./useBattleSessionState";
import { useBattleSessionOperations } from "./useBattleSessionOperations";

interface UseBattleSessionsReturn {
  sessions: BattleSession[];
  isLoading: boolean;
  error: Error | null;
  createSession: (data: { title: string; memos?: Memo[] }) => Promise<string>;
  updateSession: (
    sessionId: string,
    title: string,
    memos?: Memo[]
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

/**
 * バトルセッション管理の統合フック
 */
export function useBattleSessions(
  initialSessions: BattleSession[] = []
): UseBattleSessionsReturn {
  const state = useBattleSessionState(initialSessions);
  const operations = useBattleSessionOperations({ state });

  // 初期読み込み
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    operations.fetchSessions();
    // 依存配列を operations から operations.fetchSessions に変更
    // operations オブジェクト自体は毎回新しく作成されるが、中の関数は useCallback で安定している
  }, [operations.fetchSessions]);

  return {
    sessions: state.sessions,
    isLoading: state.isLoading,
    error: state.error,
    createSession: operations.createSession,
    updateSession: operations.updateSession,
    deleteSession: operations.deleteSession,
  };
}
