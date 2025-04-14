import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // ページボタンを生成する関数
  const renderPageButtons = () => {
    const buttons = [];

    // 最初のページへのボタン
    buttons.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        &laquo;
      </button>
    );

    // 前のページへのボタン
    buttons.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        &lt;
      </button>
    );

    // ページ番号ボタン
    // 表示するページ番号の範囲を決定
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // 表示するページ数を5つに保つための調整
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    // 次のページへのボタン
    buttons.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        &gt;
      </button>
    );

    // 最後のページへのボタン
    buttons.push(
      <button
        key="last"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        &raquo;
      </button>
    );

    return buttons;
  };

  return (
    <div className={styles.pagination}>
      {renderPageButtons()}
      <div className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
