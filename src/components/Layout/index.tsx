"use client";
import { usePathname } from 'next/navigation';
import Header from '../Header';
import Footer from '../Footer';
import styles from './Layout.module.css';
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  // wysiwygページではヘッダーのみ非表示にする
  const isWysiwygPage = pathname === '/wysiwyg';

  return (
    <SessionProvider>
      <AuthProvider>
        {!isWysiwygPage && <Header />}
        <main className={`${styles.main} ${isWysiwygPage ? styles.wysiwyg : ''}`}>
          {children}
        </main>
        {!isWysiwygPage && <Footer />}
      </AuthProvider>
    </SessionProvider>
  );
}
