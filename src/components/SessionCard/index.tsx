import { BattleSession } from "@/types/battleSession";
import { useSessionMemos } from "@/hooks/useSessionMemos";
import styles from "./SessionCard.module.css";

interface SessionCardProps {
  session: BattleSession;
  onClick: () => void;
}

/**
 * バトルセッションのカードコンポーネント
 */
export function SessionCard({ session, onClick }: SessionCardProps) {
  const { memosCount } = useSessionMemos(session.id);

  return (
    <div className={styles.card} onClick={onClick}>
      <h3>{session.title || "(no title)"}</h3>
      <p>{memosCount} memos</p>
      <p>Last updated: {session.updatedAt.toDate().toLocaleString()}</p>
    </div>
  );
}
