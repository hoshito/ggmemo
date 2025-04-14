export const muiStyles = {
  toggleButtonGroup: {
    width: "100%",
    display: "flex",
    "& .MuiToggleButton-root": {
      flex: 1,
      borderRadius: 0,
    },
    "& .MuiToggleButton-root:first-of-type": {
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
    },
    "& .MuiToggleButton-root:last-of-type": {
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
    },
  },
} as const;
