"use client";

import { useCallback, useState } from "react";
import styles from "./page.module.css";
import NoteStyleMemoEditor from "./NoteStyleMemoEditor";
import SessionStats from "@/components/SessionStats";
import { Memo } from "@/types/memo";

export default function WysiwygPage() {
  const [noteContent, setNoteContent] = useState('<p>Write your game notes here...</p>');
  const [memoStats, setMemoStats] = useState<Memo[]>([]);

  const handleContentUpdate = useCallback((newContent: string, resultCounts: {
    win: number,
    lose: number
  }) => {
    setNoteContent(newContent);

    // Generate memo stats using functional array creation
    const winMemos = Array.from({ length: resultCounts.win }, (_, i) => ({
      id: `win-${i}`,
      title: 'Game',
      result: 'WIN' as const,
      memo: '',
      createdAt: new Date().toISOString(),
    }));
    const loseMemos = Array.from({ length: resultCounts.lose }, (_, i) => ({
      id: `lose-${i}`,
      title: 'Game',
      result: 'LOSE' as const,
      memo: '',
      createdAt: new Date().toISOString(),
    }));
    setMemoStats([...winMemos, ...loseMemos]);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.statsWrapper}>
        <SessionStats memos={memoStats} />
      </div>

      <div className={styles.editorWrapper}>
        <NoteStyleMemoEditor
          content={noteContent}
          onUpdate={handleContentUpdate}
        />
      </div>
    </div>
  );
}
