"use client";

import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <h2 className={styles.aboutHeading}>What is GGMemo?</h2>
      <p className={styles.aboutDescription}>
        GGMemo (&ldquo;Good Game Memo&rdquo;) is a powerful memo tool designed specifically for gamers to track and analyze their match results. Whether you play casually or competitively, GGMemo helps you identify patterns and improve your gameplay.
      </p>

      <h2 className={styles.aboutHeading}>Basic Mode</h2>
      <p className={styles.aboutDescription}>
        Without signing in, you can:
      </p>
      <ul className={styles.aboutDescription}>
        <li>Create quick memos with titles (up to 100 characters)</li>
        <li>Add, edit, and delete memos with ease</li>
        <li>View basic statistics about your games</li>
        <li>Store data securely in your browser</li>
        <li>Export your data in Markdown format</li>
      </ul>

      <h2 className={styles.aboutHeading}>Session Mode</h2>
      <p className={styles.aboutDescription}>
        With Google sign-in, you unlock the full potential:
      </p>
      <ul className={styles.aboutDescription}>
        <li>Create multiple battle sessions (up to 20) for different games or seasons</li>
        <li>Store more detailed memos per session (up to 50)</li>
        <li>Write comprehensive notes (up to 300 characters)</li>
        <li>Record win/loss results to track your success rate</li>
        <li>Add performance ratings to analyze your gameplay quality</li>
        <li>View detailed statistics and trends per session</li>
        <li>Sync your data seamlessly across all your devices</li>
        <li>Access your memos even when offline (as a PWA)</li>
      </ul>
    </section>
  );
}
