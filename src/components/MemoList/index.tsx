import { useState } from "react";
import MemoCard from "../MemoCard";
import MemoForm from "../MemoForm";
import MemoOperations from "../MemoOperations";
import styles from "./MemoList.module.css";
import { Memo, MAX_MEMOS_PER_SESSION } from "@/types/memo";

interface MemoListProps {
  memos: Memo[];
  onEdit: (id: string, updatedMemo: Omit<Memo, "id" | "createdAt">) => void;
  onDelete: (id: string) => void;
  onViewStats: () => void;
  onDeleteAll?: () => void;
  hideRating?: boolean;
}

export default function MemoList({
  memos,
  onEdit,
  onDelete,
  onViewStats,
  onDeleteAll,
  hideRating = false,
}: MemoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditClick = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (memo: Omit<Memo, "id" | "createdAt">) => {
    if (editingId) {
      onEdit(editingId, memo);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = () => {
    if (editingId) {
      onDelete(editingId);
      setEditingId(null);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.memoCount}>
          <span>{memos.length} / {MAX_MEMOS_PER_SESSION}</span>{memos.length === 1 ? " memo" : " memos"}
        </div>
        <MemoOperations
          onViewStats={onViewStats}
          onDeleteAll={onDeleteAll}
        />
      </div>
      <div className={styles.memoList}>
        {memos.map((memo) => (
          <div key={memo.id} className={styles.memoItem}>
            {editingId === memo.id ? (
              <MemoForm
                initialData={memo}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                hideRating={hideRating}
                memosCount={memos.length}
              />
            ) : (
              <MemoCard
                {...memo}
                onEditClick={() => handleEditClick(memo.id)}
                hideRating={hideRating}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
