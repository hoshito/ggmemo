import { Modal, Box, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { alpha } from "@mui/material/styles";
import { Google as GoogleIcon } from "@mui/icons-material";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SignInModal({ open, onClose }: SignInModalProps) {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/mypage" });
      onClose();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sign-in-modal"
      sx={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(74, 74, 124, 0.6)",
        "&:focus": {
          outline: "none",
        },
      }}
    >
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "var(--modal-background)",
        color: "var(--foreground)",
        boxShadow: theme => `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`,
        p: 4,
        borderRadius: 2,
        transition: "opacity 0.2s ease-in-out",
        opacity: 1,
        "&:focus": {
          outline: "none",
        },
      }}>
        <Typography
          variant="h6"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            color: "var(--foreground)",
            fontWeight: 600,
            mb: 3,
          }}
        >
          Sign in to GGMemo
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={handleGoogleSignIn}
          sx={{
            mt: 2,
            bgcolor: "var(--modal-surface)",
            color: "var(--foreground)",
            textTransform: "none",
            fontSize: "1rem",
            py: 1.5,
            "&:hover": {
              bgcolor: "var(--primary)",
            },
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GoogleIcon />
            Continue with Google
          </Box>
        </Button>
      </Box>
    </Modal>
  );
}
