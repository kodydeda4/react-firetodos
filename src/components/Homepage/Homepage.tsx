import React from "react";
import { Redirect } from "react-router-dom";
import ROUTES from "../../routes";
import { storeHooks } from "../../store";
import AppHeader from "./AppHeader";
import Todos from "./Todos";

export default function Homepage() {
  if (!storeHooks.useStoreState((state) => state.authModel.user)) {
    return <Redirect to={ROUTES.login} push={true} />;
  } else {
    return <Todos />;
  }
}
