"use client";

import { Dialog } from "@headlessui/react";
import { Memo } from "@/types/memo";
import styles from "./StatsView.module.css";
import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { calculateStats, generateMarkdown, chartColors, chartOptions } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface StatsViewProps {
  memos: Memo[];
  isOpen: boolean;
  onClose: () => void;
  sessionTitle?: string;
  hideRating?: boolean;
}

export default function StatsView({ memos, isOpen, onClose, sessionTitle, hideRating = false }: StatsViewProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const stats = calculateStats(memos);
  const historyMarkdown = generateMarkdown(memos, stats, sessionTitle, hideRating);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(historyMarkdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className={styles.modalOverlay}>
      <Dialog.Panel className={styles.modalContent}>
        <div className={styles.header}>
          <Dialog.Title className={styles.title}>Battle Stats</Dialog.Title>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Games</span>
            <span className={styles.statValue}>{stats.totalGames}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Wins</span>
            <span className={styles.statValue}>{stats.wins}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Losses</span>
            <span className={styles.statValue}>{stats.losses}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Win Rate</span>
            <span className={styles.statValue}>{stats.winRate}%</span>
          </div>
          {!hideRating && (
            <>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Average Rating</span>
                <span className={styles.statValue}>{stats.averageRating}★</span>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.chartRound}>
                  <Pie
                    data={{
                      labels: ["Wins", "Losses"],
                      datasets: [
                        {
                          data: [stats.wins, stats.losses],
                          backgroundColor: [
                            chartColors.win.bg,
                            chartColors.lose.bg,
                          ],
                          borderColor: [
                            chartColors.win.border,
                            chartColors.lose.border,
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={chartOptions.pieOptions}
                  />
                </div>
                <div className={styles.chartWide}>
                  <Bar
                    data={{
                      labels: ["★★★★★", "★★★★", "★★★", "★★", "★"],
                      datasets: [
                        {
                          label: "Rating Distribution",
                          data: [...stats.ratingDistribution].reverse(),
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderColor: "rgba(255, 255, 255, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={chartOptions.barOptions}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <button
            className={styles.copyButton}
            onClick={handleCopy}
            aria-label={copySuccess ? "Copy complete" : "Copy markdown"}
          >
            {copySuccess ? "Copied!" : "Copy Markdown"}
          </button>
        </div>

        <div className={styles.rawMarkdown}>{historyMarkdown}</div>
      </Dialog.Panel>
    </Dialog>
  );
}
