import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { StoreProvider } from "easy-peasy";
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import useAppTheme from "../hooks/useAppTheme";
import ROUTES from "../routes";
import { appStore } from "../store/App";
import Login from "./Login";
import NewApp from "./Colors";
import NotFound from "./NotFound";
import Signup from "./Signup";
import TodosList from "./TodosList";
import FireTodos from "./FireTodos";
import Colors from "./Colors";

// [How to set up React with Firebase/Firestore v9] https://www.youtube.com/watch?v=ig91zc-ERSE

export default function App() {
  return (
    <ThemeProvider theme={useAppTheme()}>
      <CssBaseline />
      <StoreProvider store={appStore}>
        <HashRouter>
          <Switch>
            <Route exact path={ROUTES.login} component={Login} />
            <Route exact path={ROUTES.signup} component={Signup} />
            {/* <Route exact path={ROUTES.home} component={FireTodos} /> */}
            <Route exact path={ROUTES.home} component={Colors} />
            <Route component={NotFound} />
          </Switch>
        </HashRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}