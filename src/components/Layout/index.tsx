"use client";
import Header from '../Header';
import Footer from '../Footer';
import styles from './Layout.module.css';
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
        <Footer />
      </AuthProvider>
    </SessionProvider>
  );
}
