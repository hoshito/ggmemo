"use client";

import { useEffect, useState, useRef } from "react";
import { Memo } from "@/types/memo";
import styles from "./SessionStats.module.css";

interface SessionStatsProps {
  memos: Memo[];
}

interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: string;
  loseRate: string;
}

export default function SessionStats({ memos }: SessionStatsProps) {
  const [animateStats, setAnimateStats] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 戦績を計算
  const stats: Stats = {
    totalGames: memos.length,
    wins: memos.filter((memo) => memo.result === "WIN").length,
    losses: memos.filter((memo) => memo.result === "LOSE").length,
    winRate: memos.length > 0
      ? ((memos.filter((memo) => memo.result === "WIN").length / memos.length) * 100).toFixed(1)
      : "0.0",
    loseRate: memos.length > 0
      ? ((memos.filter((memo) => memo.result === "LOSE").length / memos.length) * 100).toFixed(1)
      : "0.0"
  };

  // アニメーション用のエフェクト
  useEffect(() => {
    setAnimateStats(true);

    // プログレスバーのアニメーション
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${parseFloat(stats.winRate)}%`;
    }
  }, [stats.winRate]);

  // 戦績がない場合の表示
  if (memos.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "1.5rem" }}>
          No battles recorded yet. Add your first memo to start tracking stats!
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 装飾要素 */}
      <div className={`${styles.decoration} ${styles.decoration1}`}></div>
      <div className={`${styles.decoration} ${styles.decoration2}`}></div>
      <div className={styles.diagonalLines}></div>

      <div className={styles.resultsContainer}>
        <div className={styles.centerDivider}></div>

        <div className={`${styles.resultBlock} ${styles.winBlock}`}>
          <span className={`${styles.resultValue} ${styles.winValue}`}>{stats.wins}</span>
          <span className={styles.resultLabel}>Wins</span>
        </div>

        <div className={`${styles.resultBlock} ${styles.loseBlock}`}>
          <span className={`${styles.resultValue} ${styles.loseValue}`}>{stats.losses}</span>
          <span className={styles.resultLabel}>Losses</span>
        </div>
      </div>

      <div className={styles.statsFooter}>
        <div className={styles.progressBar}>
          <div
            ref={progressBarRef}
            className={styles.progressFill}
            style={{ width: animateStats ? `${parseFloat(stats.winRate)}%` : '0%' }}
          ></div>
        </div>

        <div className={styles.progressLabels}>
          <span className={styles.winPercent}>{stats.winRate}%</span>
          <span className={styles.losePercent}>{stats.loseRate}%</span>
        </div>
      </div>
    </div>
  );
}
