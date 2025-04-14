"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUser, GoogleAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { signOut, useSession } from "next-auth/react";
import { deleteAllBattleSessions } from "@/lib/services/battleSessionService";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DeleteAccountDialog({
  open,
  onClose,
}: DeleteAccountDialogProps) {
  const { user, isInitializing } = useAuth();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    setError("");

    try {
      if (!session?.idToken) throw new Error("Authentication token not found");
      const credential = GoogleAuthProvider.credential(session.idToken);
      await reauthenticateWithCredential(user, credential);

      // Firestoreのデータを削除
      await deleteAllBattleSessions(user.uid);

      // Firebaseのユーザーアカウントを削除
      await deleteUser(user);
      await signOut({ callbackUrl: "/" });
      onClose();
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(
        "An error occurred while trying to delete your account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-account-dialog-title"
      PaperProps={{
        sx: {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        },
      }}
    >
      <DialogTitle id="delete-account-dialog-title">Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "var(--foreground)" }}>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </DialogContentText>
        {error && (
          <DialogContentText sx={{ color: "error.main", mt: 2 }}>
            {error}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting || isInitializing}>
          Cancel
        </Button>
        <Button
          onClick={handleDeleteAccount}
          color="error"
          disabled={isDeleting || isInitializing}
          startIcon={
            isDeleting || isInitializing ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
