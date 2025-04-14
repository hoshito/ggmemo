"use client";

import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import styles from "./InstallPWAButton.module.css";

export function InstallPWAButton() {
  const { canInstall, showInstallPrompt } = usePWAInstall();

  if (!canInstall) {
    return null;
  }

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<DownloadIcon />}
      onClick={showInstallPrompt}
      className={styles.installButton}
    >
      Install App
    </Button>
  );
}
