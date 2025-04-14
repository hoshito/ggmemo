import ToggleButton from "@mui/material/ToggleButton";
import { Memo } from "@/types/memo";

interface WinLoseButtonProps {
  value: Memo["result"];
}

export default function WinLoseButton({ value }: WinLoseButtonProps) {
  const getBackgroundColor = (result: string) => {
    switch (result) {
      case 'WIN':
        return 'var(--result-win)';
      case 'LOSE':
        return 'var(--result-lose)';
      default:
        return 'var(--surface)';
    }
  };
  return (
    <ToggleButton
      sx={{
        paddingInline: "1rem",
        paddingBlock: "0.35rem",
        color: "var(--foreground)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--divider)",
        fontSize: "0.85rem",
        fontWeight: "500",
        letterSpacing: "0.8px",
        transition: "all 0.15s ease",
        overflow: "hidden",
        "&:hover": {
          backgroundColor: "var(--hover)",
          transform: "translateY(-1px)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
        },
        "&.Mui-selected": {
          color: "var(--foreground)",
          backgroundColor: "var(--surface)",
          borderColor: "transparent",
          borderTop: `3px solid ${getBackgroundColor(value)}`,
          "&:hover": {
            backgroundColor: "var(--hover)",
            transform: "translateY(-1px)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
          }
        },
        "&.Mui-focusVisible": {
          boxShadow: "0 0 0 2px var(--background), 0 0 0 4px var(--key)"
        }
      }}
      value={value}
    >{value}</ToggleButton>
  )
}
