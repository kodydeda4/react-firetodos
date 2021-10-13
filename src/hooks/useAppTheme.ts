import { useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React from "react";

export default function useAppTheme() {
  const mode = useSystemMode();

  return createTheme({
    palette: {
      mode,
    },
  });
}

const useSystemMode = (): "light" | "dark" => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return React.useMemo(
    () => (prefersDarkMode ? "dark" : "light"),
    [prefersDarkMode]
  );
}
