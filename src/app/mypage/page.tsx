"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBattleSessions } from "@/hooks/useBattleSessions";
import { useAuth } from "@/contexts/AuthContext";
import { SessionCard } from "@/components/SessionCard";
import { MAX_BATTLE_SESSIONS } from "@/types/battleSession";
import styles from "./page.module.css";

export default function MyPage() {
  const { sessions, error, createSession } = useBattleSessions();
  const { user, isInitializing } = useAuth();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);

  // 新規セッションの作成
  const handleCreateSession = async () => {
    try {
      setCreateError(null);
      setIsCreating(true);
      const sessionId = await createSession({
        title: "",
      });
      await router.push(`/session/${sessionId}`);
    } catch (err) {
      setCreateError(err instanceof Error ? err : new Error('Failed to create session'));
      setIsCreating(false);
    }
  };

  // 初期化中はローディング表示
  if (isInitializing || isCreating) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: "center" }}>Loading...</p>
      </div>
    );
  }

  // 未認証の場合はエラーメッセージを表示
  if (!user) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: "center" }}>Please sign in to view your battle sessions.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Battle Sessions</h1>

      {/* エラーメッセージ表示エリア */}
      {(createError || error) && (
        <div className={styles.error}>
          {createError ? createError.message : error?.message}
        </div>
      )}

      {/* 新規セッション作成ボタン */}
      <button className={styles.createButton} onClick={handleCreateSession}>
        Create New Session
      </button>

      {/* セッション数カウンター */}
      <div className={styles.sessionCount}>
        <span>{sessions.length} / {MAX_BATTLE_SESSIONS}</span>
        {sessions.length === 1 ? "battle session" : "battle sessions"}
      </div>

      {/* セッション一覧 */}
      <div className={styles.sessionList}>
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onClick={() => router.push(`/session/${session.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
