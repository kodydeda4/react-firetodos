import { deepmerge } from "@mui/utils";
import ArrowDropDownRounded from "@mui/icons-material/ArrowDropDownRounded";
import { createTheme, ThemeOptions, Theme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import React from "react";

export default function useAppTheme() {
  const mode = useSystemMode();

  return createTheme({
    palette: {
      mode,
    },
  });
}

export function useSystemMode(): "light" | "dark" {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return React.useMemo(
    () => (prefersDarkMode ? "dark" : "light"),
    [prefersDarkMode]
  );
}
