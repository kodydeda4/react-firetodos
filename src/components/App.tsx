import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { StoreProvider } from "easy-peasy";
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import useAppTheme from "../hooks/useAppTheme";
import ROUTES from "../routes";
import { appStore } from "../store/AppStore";
import Colors from "./Colors";
import FireTodos from "./FireTodos";
import Login from "./Login";
import NotFound from "./NotFound";
import Signup from "./Signup";

export default function App() {
  return (
    <ThemeProvider theme={useAppTheme()}>
      <CssBaseline />
      <StoreProvider store={appStore}>
        <HashRouter>
          <Switch>
            <Route exact path={ROUTES.login} component={Login} />
            <Route exact path={ROUTES.signup} component={Signup} />
            <Route exact path={ROUTES.home} component={FireTodos} />
            {/* <Route exact path={ROUTES.home} component={Colors} /> */}
            <Route component={NotFound} />
          </Switch>
        </HashRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}