import { getAuth } from "firebase/auth";
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { useUpdatePremium } from "../hooks/useUpdatePremium";
import { useUpdateTodos } from "../hooks/useUpdateTodos";
import ROUTES from "../routes";
import { storeHooks } from "../store";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Todos from "./pages/Todos";
import PrivateRoute from "./_helpers/PrivateRoute";

export default function StoreContext() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state),
    actions: storeHooks.useStoreActions((action) => action),
  };

  useUpdateTodos({
    user: getAuth().currentUser,
    setter: viewStore.actions.setTodos,
  });

  useUpdatePremium({
    user: getAuth().currentUser,
    setter: viewStore.actions.setHasPremium,
  });

  return (
    <HashRouter>
      <Switch>
        {/* Standard */}
        <Route exact path={ROUTES.login} component={Login} />
        <Route exact path={ROUTES.signup} component={Signup} />
        <Route exact path={ROUTES.forgotPassword} component={ForgotPassword} />

        {/* Private */}
        <PrivateRoute exact path={ROUTES.home} component={Todos} />
        <PrivateRoute exact path={ROUTES.profile} component={Profile} />

        {/* Default */}
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  );
}
