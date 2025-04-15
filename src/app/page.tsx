"use client";
import { useState } from "react";
import MemoList from "@/components/MemoList";
import MemoForm from "@/components/MemoForm";
import StatsView from "@/components/StatsView";
import AboutSection from "@/components/AboutSection";
import SessionStats from "@/components/SessionStats";
import styles from "./page.module.css";
import { useMemos } from "@/hooks/useMemos";
import { Memo } from "@/types/memo";

export default function Home() {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const {
    memos,
    totalMemos,
    addMemo,
    updateMemo,
    deleteMemo,
    deleteAllMemos,
  } = useMemos();

  const handleAddMemo = (newMemoData: Omit<Memo, "id" | "createdAt">) => {
    addMemo({ ...newMemoData, title });
  };

  return (
    <div className={styles.container}>
      <div style={{ minHeight: "90vh", position: "relative" }}>
        {/* Title and memo form section */}
        <div className={styles.formSection}>
          <div className={styles.componentWrapper}>
            <MemoForm
              onSave={handleAddMemo}
              hideRating={true}
              memosCount={totalMemos}
            />
          </div>
        </div>

        {/* Memo list with stats section */}
        {totalMemos > 0 && (
          <div className={styles.memoListContainer}>
            {/* Stats display inside the memo list container */}
            <div className={styles.statsWrapper}>
              <SessionStats memos={memos} />
            </div>

            <div className={styles.memoListWrapper}>
              <MemoList
                memos={memos}
                onEdit={updateMemo}
                onDelete={deleteMemo}
                onViewStats={() => setIsStatsOpen(true)}
                onDeleteAll={deleteAllMemos}
                hideRating={true}
              />
            </div>
          </div>
        )}

        {/* Markdown export modal */}
        <StatsView
          memos={memos}
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          sessionTitle={title || "Quick Session"}
          hideRating={true}
        />
      </div>
      <AboutSection />
    </div>
  );
}
