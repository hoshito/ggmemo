import styles from "./MemoOperations.module.css";

interface MemoOperationsProps {
  onViewStats: () => void;  // 関数名はそのままにしておきます
  onDeleteAll?: () => void;
}

export default function MemoOperations({
  onViewStats,
  onDeleteAll
}: MemoOperationsProps) {
  return (
    <div className={styles.container}>
      <button className={styles.actionButton} onClick={onViewStats}>
        View Markdown
      </button>
      {onDeleteAll && (
        <button
          className={`${styles.actionButton} ${styles.deleteButton}`}
          onClick={() => {
            if (window.confirm("Are you sure you want to delete all memos? This action cannot be undone.")) {
              onDeleteAll();
            }
          }}
        >
          Delete All
        </button>
      )}
    </div>
  );
}
