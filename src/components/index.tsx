import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { StoreProvider } from "easy-peasy";
import { HashRouter, Route, Switch } from "react-router-dom";
import useAppTheme from "../hooks/useAppTheme";
import ROUTES from "../routes";
import { store } from "../store";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Todos from "./pages/Todos";
import PrivateRoute from "./_helpers/PrivateRoute";

export default function App() {
  return (
    <ThemeProvider theme={useAppTheme()}>
      <CssBaseline />
      <StoreProvider store={store}>
        <HashRouter>
          <Switch>
            {/* Standard */}
            <Route exact path={ROUTES.login} component={Login} />
            <Route exact path={ROUTES.signup} component={Signup} />
            <Route exact path={ROUTES.forgotPW} component={ForgotPassword} />

            {/* Private */}
            <PrivateRoute exact path={ROUTES.home} component={Todos} />
            <PrivateRoute exact path={ROUTES.profile} component={Profile} />

            {/* Default */}
            <Route component={NotFound} />
          </Switch>
        </HashRouter>
      </StoreProvider>
    </ThemeProvider>
  );
}


