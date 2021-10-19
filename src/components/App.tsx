import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { StoreProvider } from "easy-peasy";
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import useAppTheme from "../hooks/useAppTheme";
import ROUTES from "../routes";
import { store } from "../store";
import ForgotPassword from "./Authpage/ForgotPassword";
import Login from "./Authpage/Login";
import Signup from "./Authpage/Signup";
import Profile from "./Homepage/Profile";
import NotFound from "./NotFound";
import Homepage from "./Homepage/Homepage";

export default function App() {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={useAppTheme()}>
        <CssBaseline />
        <HashRouter>
          <Switch>
            <Route exact path={ROUTES.login} component={Login} />
            <Route exact path={ROUTES.signup} component={Signup} />
            <Route exact path={ROUTES.home} component={Homepage} />
            <Route exact path={ROUTES.profile} component={Profile} />
            <Route exact path={ROUTES.forgotPassword} component={ForgotPassword}/>
            <Route component={NotFound} />
          </Switch>
        </HashRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}
