"use client";

import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <h2 className={styles.aboutHeading}>What is GGMemo?</h2>
      <p className={styles.aboutDescription}>
        GGMemo (&ldquo;Good Game Memo&rdquo;) is a memo tool for tracking your game matches. It offers both a quick memo mode and a detailed session-based tracking system.
      </p>

      <h2 className={styles.aboutHeading}>Basic Mode</h2>
      <p className={styles.aboutDescription}>
        Without signing in, you can:
      </p>
      <ul className={styles.aboutDescription}>
        <li>Create memos with titles (up to 100 characters)</li>
        <li>Add, edit, and delete memos</li>
        <li>View basic statistics</li>
        <li>Store data in your browser</li>
      </ul>

      <h2 className={styles.aboutHeading}>Session Mode</h2>
      <p className={styles.aboutDescription}>
        With Google sign-in, you get access to:
      </p>
      <ul className={styles.aboutDescription}>
        <li>Create multiple battle sessions (up to 20)</li>
        <li>Store more memos per session (up to 50)</li>
        <li>Write longer memos (up to 300 characters)</li>
        <li>Record win/loss results</li>
        <li>Add performance ratings</li>
        <li>Track statistics per session</li>
        <li>Sync data across devices</li>
      </ul>
    </section>
  );
}
