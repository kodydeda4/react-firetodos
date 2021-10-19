import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { StoreProvider } from "easy-peasy";
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import useAppTheme from "../hooks/useAppTheme";
import ROUTES from "../routes";
import { store } from "../store";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import NotFound from "./NotFound";
import Signup from "./Signup";
import Profile from "./Todos/Profile";
import Todos from "./Todos/Todos";

export default function App() {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={useAppTheme()}>
        <CssBaseline />
        <HashRouter>
          <Switch>
            <Route exact path={ROUTES.login} component={Login} />
            <Route exact path={ROUTES.signup} component={Signup} />
            <Route exact path={ROUTES.home} component={Todos} />
            <Route exact path={ROUTES.profile} component={Profile} />
            <Route exact path={ROUTES.forgotPassword} component={ForgotPassword}/>
            <Route component={NotFound} />
          </Switch>
        </HashRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}
