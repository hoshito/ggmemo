import { useEffect, useState, useRef } from "react";
import { Memo } from "@/types/memo";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/**
 * メモリストの状態を管理し、サブコレクションとの同期を行うフック
 */
export function useSessionMemos(sessionId: string) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // セッションIDが変更されたときにリスナーを再設定
  useEffect(() => {
    // セッションIDが空の場合は何もしない
    if (!sessionId) {
      setLoading(false);
      setMemos([]);
      return;
    }

    // 前回のAbortControllerをクリーンアップ
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // 既存のリスナーをクリーンアップ
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setLoading(true);
    setError(null);
    setMemos([]);

    const memosRef = collection(db, "battleSessions", sessionId, "memos");
    const q = query(memosRef, orderBy("createdAt", "desc"));

    try {
      console.log("Setting up new listener for session:", sessionId);
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (signal.aborted) return;

          console.log("Received Firestore update for session:", sessionId, {
            docsCount: snapshot.size,
            changes: snapshot.docChanges().map((change) => ({
              type: change.type,
              docId: change.doc.id,
            })),
          });

          const updatedMemos = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Memo[];

          setMemos(updatedMemos);
          setLoading(false);
        },
        (err) => {
          if (signal.aborted) return;
          console.error("Firestore listener error:", err);
          setError(err as Error);
          setLoading(false);
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      if (signal.aborted) return;
      console.error("Failed to setup Firestore listener:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to setup listener")
      );
      setLoading(false);
    }

    // クリーンアップ関数
    return () => {
      console.log("Cleaning up effect for session:", sessionId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [sessionId]);

  return {
    memos,
    loading,
    error,
    memosCount: memos.length,
  };
}
