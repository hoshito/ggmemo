import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateBattleSessionData } from "@/types/battleSession";
import { Memo } from "@/types/memo";
import {
  createBattleSession,
  getBattleSessions,
  updateBattleSession,
  deleteBattleSession,
} from "@/lib/services/battleSessionService";
import { createBattleSessionError } from "@/lib/errors/utils";
import { ErrorCode, ErrorSeverity } from "@/lib/errors/types";
import { UseBattleSessionStateReturn } from "./useBattleSessionState";

interface UseBattleSessionOperationsProps {
  state: UseBattleSessionStateReturn;
}

interface UseBattleSessionOperationsReturn {
  fetchSessions: () => Promise<boolean>;
  createSession: (data: { title: string; memos?: Memo[] }) => Promise<string>;
  updateSession: (
    sessionId: string,
    title: string,
    memos?: Memo[]
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

/**
 * バトルセッションの操作を管理するフック
 */
export function useBattleSessionOperations({
  state,
}: UseBattleSessionOperationsProps): UseBattleSessionOperationsReturn {
  const { user } = useAuth();
  const { setSessions, setLoading, setError } = state;

  /**
   * セッション一覧の取得
   */
  const fetchSessions = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) {
      setSessions([]);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getBattleSessions(user.uid);
      setSessions(result.sessions);
      return true;
    } catch (err) {
      // エラーをそのまま伝播
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, setSessions, setLoading, setError]);

  /**
   * セッションの作成
   */
  const createSession = useCallback(
    async (data: { title: string; memos?: Memo[] }): Promise<string> => {
      try {
        setError(null);

        // 認証チェックを最初に行い、エラーをそのまま投げる
        if (!user?.uid) {
          const error = createBattleSessionError(
            ErrorCode.UNAUTHORIZED,
            "You must be signed in to create a session",
            ErrorSeverity.ERROR
          );
          setError(error);
          throw error;
        }

        try {
          const newSession: CreateBattleSessionData = {
            userId: user.uid,
            title: data.title,
            memos: data.memos ?? [],
          };

          const sessionId = await createBattleSession(newSession);
          await fetchSessions();
          return sessionId;
        } catch (err) {
          // エラーをセットする前にセッション一覧を更新
          await fetchSessions();

          if (
            err instanceof Error &&
            "code" in err &&
            err.code === ErrorCode.SESSION_LIMIT_EXCEEDED
          ) {
            setError(err);
            throw err;
          } else {
            const error = createBattleSessionError(
              ErrorCode.SESSION_CREATE_FAILED,
              "Failed to create session",
              ErrorSeverity.ERROR,
              { title: data.title },
              err instanceof Error ? err : undefined
            );
            setError(error);
            throw error;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Unknown error occurred");
      }
    },
    [user?.uid, fetchSessions, setError]
  );

  /**
   * セッションの更新
   */
  const updateSession = useCallback(
    async (sessionId: string, title: string, memos?: Memo[]): Promise<void> => {
      try {
        setError(null);

        if (!user?.uid) {
          throw createBattleSessionError(
            ErrorCode.UNAUTHORIZED,
            "You must be signed in to update a session",
            ErrorSeverity.ERROR
          );
        }

        await updateBattleSession(sessionId, { title, memos: memos ?? [] });
        await fetchSessions();
      } catch (err) {
        const error = createBattleSessionError(
          ErrorCode.SESSION_UPDATE_FAILED,
          "Failed to update session",
          ErrorSeverity.ERROR,
          { sessionId, title },
          err instanceof Error ? err : undefined
        );
        setError(error);
        throw error;
      }
    },
    [user?.uid, fetchSessions, setError]
  );

  /**
   * セッションの削除
   */
  const deleteSession = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        setError(null);

        if (!user?.uid) {
          throw createBattleSessionError(
            ErrorCode.UNAUTHORIZED,
            "You must be signed in to delete a session",
            ErrorSeverity.ERROR
          );
        }

        await deleteBattleSession(sessionId);
        await fetchSessions();
      } catch (err) {
        const error = createBattleSessionError(
          ErrorCode.SESSION_DELETE_FAILED,
          "Failed to delete session",
          ErrorSeverity.ERROR,
          { sessionId },
          err instanceof Error ? err : undefined
        );
        setError(error);
        throw error;
      }
    },
    [user?.uid, fetchSessions, setError]
  );

  return {
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
}
