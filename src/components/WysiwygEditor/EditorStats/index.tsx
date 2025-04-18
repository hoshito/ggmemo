import React, { useState } from 'react';
import Link from 'next/link';
import styles from './EditorStats.module.css';
import { Memo } from '@/types/memo';

type EditorStatsProps = {
  memoStats: Memo[];
};

/**
 * エディターの統計情報を表示するコンポーネント
 */
const EditorStats = ({ memoStats }: EditorStatsProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 勝率計算
  const winCount = memoStats.filter(memo => memo.result === 'WIN').length;
  const winRate = memoStats.length
    ? Math.round((winCount / memoStats.length) * 100)
    : 0;

  return (
    <div className={styles.statsOverlay}>
      <div className={`${styles.statsCard} ${isCollapsed ? styles.collapsed : ''}`}>
        <h3 onClick={() => setIsCollapsed(!isCollapsed)}>
          Game Stats
          <span className={`${styles.collapseButton}`}>
            <span className={styles.collapseIcon}>▲</span>
          </span>
        </h3>
        <div className={styles.statsFlex}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Wins:</span>
            <span className={styles.statValue}>{winCount}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Losses:</span>
            <span className={styles.statValue}>{memoStats.filter(memo => memo.result === 'LOSE').length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Win Rate:</span>
            <span className={styles.statValue}>{winRate}%</span>
          </div>
        </div>
        {/* ホームへのリンクと著作表記 */}
        <div className={styles.homeLink}>
          <Link href="/" title="Return to Home">← Home</Link>
          <div className={styles.copyright}>© GGMemo</div>
        </div>
      </div>
    </div>
  );
};

export default EditorStats;
