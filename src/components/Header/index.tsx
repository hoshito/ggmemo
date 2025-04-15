"use client";
import Link from "next/link";
import { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import SignInModal from "@/components/SignInModal";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import styles from "./Header.module.css";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function Header() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session, status } = useSession();
  const { canInstall, showInstallPrompt } = usePWAInstall();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    setAnchorEl(null);
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link href="/" className={styles.homeLink}>
          <ThumbUpIcon sx={{ fontSize: 24, color: "white" }} />
          <span className={styles.title}>GGMemo</span>
        </Link>
        <div className={styles.rightContent}>
          {status === "loading" ? null : session ? (
            <>
              <div className={styles.userInfo} onClick={handleMenuOpen}>
                <Avatar
                  src={session.user?.image || undefined}
                  alt={session.user?.name || "User"}
                  sx={{ width: 32, height: 32 }}
                />
                <span className={styles.userName}>{session.user?.name}</span>
              </div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                disableScrollLock
                PaperProps={{
                  sx: {
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)"
                  }
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Link href="/mypage" style={{ textDecoration: "none", color: "inherit" }}>
                  <MenuItem onClick={handleMenuClose}>
                    <PersonIcon sx={{ mr: 1 }} />
                    My Page
                  </MenuItem>
                </Link>
                {canInstall && (
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      showInstallPrompt();
                    }}
                  >
                    <DownloadIcon sx={{ mr: 1 }} />
                    Install App
                  </MenuItem>
                )}
                <MenuItem onClick={handleSignOut}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    setIsDeleteDialogOpen(true);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon sx={{ mr: 1 }} />
                  Delete Account
                </MenuItem>
              </Menu>
              <DeleteAccountDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
              />
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<LoginIcon />}
              onClick={() => setIsSignInModalOpen(true)}
              className={styles.authButton}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      <SignInModal
        open={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </header>
  );
}
