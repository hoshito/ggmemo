import { useState } from "react";
import { BattleSession } from "@/types/battleSession";

export interface UseBattleSessionStateReturn {
  sessions: BattleSession[];
  isLoading: boolean;
  error: Error | null;
  setSessions: (sessions: BattleSession[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  resetState: () => void;
}

/**
 * バトルセッションの状態管理フック
 */
export function useBattleSessionState(
  initialSessions: BattleSession[] = []
): UseBattleSessionStateReturn {
  const [sessions, setSessions] = useState<BattleSession[]>(initialSessions);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetState = () => {
    setSessions([]);
    setLoading(false);
    setError(null);
  };

  return {
    sessions,
    isLoading,
    error,
    setSessions,
    setLoading,
    setError,
    resetState,
  };
}
