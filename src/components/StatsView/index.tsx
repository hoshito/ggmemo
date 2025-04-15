"use client";

import { Dialog } from "@headlessui/react";
import { Memo } from "@/types/memo";
import styles from "./StatsView.module.css";
import { useState } from "react";
import { calculateStats, generateMarkdown } from "./utils";

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
          <Dialog.Title className={styles.title}>Markdown Export</Dialog.Title>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.markdownContent}>
          <div className={styles.markdownHeader}>
            <p className={styles.markdownInfo}>
              You can copy this markdown to share your session notes in Discord, GitHub, or any other platform that supports markdown.
            </p>
            <button
              className={styles.copyButton}
              onClick={handleCopy}
              aria-label={copySuccess ? "Copy complete" : "Copy markdown"}
            >
              {copySuccess ? "Copied!" : "Copy Markdown"}
            </button>
          </div>

          <div className={styles.markdownPreview}>
            <pre className={styles.rawMarkdown}>{historyMarkdown}</pre>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
