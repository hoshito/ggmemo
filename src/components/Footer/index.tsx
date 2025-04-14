"use client";
import Link from "next/link";
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.links}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/terms" className={styles.link}>Terms of Service</Link>
          <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} GGMemo. All rights reserved.
          <Link href="https://x.com/pokekoyomi" target="_blank" rel="noopener noreferrer" className={styles.link}>@pokekoyomi</Link>
        </div>
      </div>
    </footer>
  );
}
