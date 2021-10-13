import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import React from "react";
import useAppTheme from "../hooks/useAppTheme";
import TodosListPage from "./TodosListPage";

export default function App() {
  return (
    <ThemeProvider theme={useAppTheme()}>
      <CssBaseline />
      <TodosListPage />
    </ThemeProvider>
  );
}
