import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { StoreProvider } from "easy-peasy";
import React from "react";
import useAppTheme from "../hooks/useAppTheme";
import { store } from "../store";
import StoreContext from "./StoreContext";

export default function App() {
  return (
    <ThemeProvider theme={useAppTheme()}>
      <CssBaseline />
      <StoreProvider store={store}>
        <StoreContext/>
      </StoreProvider>
    </ThemeProvider>
  );
}

