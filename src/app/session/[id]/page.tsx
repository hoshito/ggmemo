"use client";
import { useEffect, useState, useRef } from "react";
import TitleInput from "@/components/TitleInput";
import StatsView from "@/components/StatsView";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MemoList from "@/components/MemoList";
import MemoForm from "@/components/MemoForm";
import { BattleSession } from "@/types/battleSession";
import { MemoFormData } from "@/types/memo";
import {
  getBattleSessions,
  updateBattleSession,
} from "@/lib/services/battleSessionService";
import * as memoService from "@/lib/services/memoFirestoreService";
import { useSessionMemos } from "@/hooks/useSessionMemos";
import styles from "./page.module.css";

// エラーハンドリングのヘルパー関数
const handleError = (err: unknown, defaultMessage: string): string => {
  return err instanceof Error ? err.message : defaultMessage;
};

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [battleSession, setBattleSession] = useState<BattleSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isStatsViewOpen, setIsStatsViewOpen] = useState(false);
  const { memos, error: memosError, memosCount } = useSessionMemos(sessionId);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // セッション情報の取得
  useEffect(() => {
    const fetchSession = async () => {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        setError("Please sign in to view this session");
        setIsLoading(false);
        return;
      }

      if (!session?.firebaseUid) {
        setError("User ID not found");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getBattleSessions(session.firebaseUid);
        const foundSession = result.sessions.find(s => s.id === sessionId);

        if (foundSession) {
          setBattleSession(foundSession);
          setTitle(foundSession.title);
        } else {
          setError("Session not found");
        }
      } catch (err) {
        setError(handleError(err, "Failed to load session"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, session, status]);

  // タイトル入力フィールドに自動的にフォーカスを当てる
  useEffect(() => {
    if (!isLoading && !error && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isLoading, error]);

  // メモのエラー表示を統合
  useEffect(() => {
    if (memosError) setError(memosError.message);
  }, [memosError]);

  // メモの追加
  const handleAddMemo = async (newMemoData: MemoFormData) => {
    if (!battleSession) return;

    try {
      await memoService.addMemo(battleSession.id, newMemoData);
      router.refresh();
    } catch (err) {
      setError(handleError(err, "Failed to add memo"));
      console.error("Failed to add memo:", err);
    }
  };

  // メモの更新
  const handleUpdateMemo = async (memoId: string, updatedMemoData: MemoFormData) => {
    if (!battleSession) return;

    try {
      await memoService.updateMemo(battleSession.id, memoId, updatedMemoData);
      router.refresh();
    } catch (err) {
      setError(handleError(err, "Failed to update memo"));
    }
  };

  // メモの削除
  const handleDeleteMemo = async (memoId: string) => {
    if (!battleSession) return;

    try {
      await memoService.deleteMemo(battleSession.id, memoId);
      router.refresh();
    } catch (err) {
      console.log(err);
      //setError(handleError(err, "Failed to delete memo"));
    }
  };

  // セッション削除
  const handleDeleteSession = async () => {
    if (!battleSession) return;

    if (!window.confirm("Are you sure you want to delete this session and all its memos? This action cannot be undone.")) {
      return;
    }

    try {
      await memoService.deleteSessionWithMemos(battleSession.id);
      router.push("/mypage");
    } catch (err) {
      setError(handleError(err, "Failed to delete session"));
      console.error("Session deletion error:", err);
    }
  };

  // タイトル更新
  const handleTitleUpdate = async () => {
    if (!battleSession || title === battleSession.title) return;

    try {
      await updateBattleSession(battleSession.id, { title });
      setBattleSession({ ...battleSession, title });
    } catch (err) {
      setError(handleError(err, "Failed to update title"));
    }
  };

  // ローディングまたはエラー状態の表示
  if (isLoading || error || !battleSession) {
    return (
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.error}>{error || "Session not found"}</div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <Link href="/mypage" className={styles.backLink}>← Back to My Sessions</Link>
        <button
          onClick={handleDeleteSession}
          className={`${styles.actionButton} ${styles.deleteButton}`}
          aria-label="Delete session"
        >
          Delete Session
        </button>
      </div>

      <div className={styles.newMemoForm}>
        <TitleInput
          value={title}
          onChange={setTitle}
          onBlur={handleTitleUpdate}
          placeholder="Enter title ..."
          aria-label="Session title"
          ref={titleInputRef}
        />
        <MemoForm onSave={handleAddMemo} memosCount={memosCount} />
        <MemoList
          memos={memos}
          onEdit={handleUpdateMemo}
          onDelete={handleDeleteMemo}
          onViewStats={() => setIsStatsViewOpen(true)}
        />
      </div>

      <StatsView
        memos={memos}
        isOpen={isStatsViewOpen}
        onClose={() => setIsStatsViewOpen(false)}
        sessionTitle={battleSession.title}
      />
    </div>
  );
}
