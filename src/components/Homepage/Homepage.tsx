import React from "react";
import { Redirect } from "react-router-dom";
import ROUTES from "../../routes";
import { storeHooks } from "../../store";
import Todos from "./Todos";

export default function Homepage() {
  return !storeHooks.useStoreState((state) => state.authModel.user) 
    ? (<Redirect to={ROUTES.login} push={true} />)
    : (<Todos />);
}
