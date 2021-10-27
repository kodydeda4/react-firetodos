import { useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React from "react";

// Customize MUI Theme:
// https://mui.com/customization/palette/

export default function useAppTheme() {
  const mode = useSystemMode();

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#ffa726',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      secondary: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
      }
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
