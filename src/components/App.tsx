import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { StoreProvider } from "easy-peasy";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import React, { useEffect } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { firestore } from "../config/firebase";
import { stripeConfig } from "../config/stripe";
import useAppTheme from "../hooks/useAppTheme";
import ROUTES from "../routes";
import { store, storeHooks } from "../store";
import ForgotPassword from "./Authpage/ForgotPassword";
import Login from "./Authpage/Login";
import Signup from "./Authpage/Signup";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Homepage from "./Todos";
import PrivateRoute from "./_helpers/PrivateRoute";

export default function App() {
  return (
    <ThemeProvider theme={useAppTheme()}>
      <CssBaseline />
      <StoreProvider store={store}>
        <Routez />
      </StoreProvider>
    </ThemeProvider>
  );
}

const Routez = () => {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };
  const user = storeHooks.useStoreState((state) => state.authModel.user);

  const updateTodolist = useEffect(
    () =>
      onSnapshot(
        query(firestore.todos2, where("userID", "==", user?.uid ?? "")),
        (snapshot) => {
          viewStore.actions.setTodos(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          );
          console.log(snapshot);
        }
      ),
    [user?.uid, viewStore.actions]
  );

  const updatePremium = useEffect(
    () =>
      onSnapshot(
        query(
          collection(
            getFirestore(),
            "users",
            getAuth().currentUser?.uid ?? ">>>",
            "payments"
          )
        ),
        (snapshot) =>
          viewStore.actions.setHasPremium(
            snapshot.docs
              .flatMap((doc) => {
                if (doc.data().items) {
                  return doc
                    .data()
                    .items.map((item: any) => item.price)
                    .map((price: any) => price.id);
                }
                return [];
              })
              .includes(stripeConfig.prices.premium)
          )
      ),
    [getAuth().currentUser]
  );

  return (
    <HashRouter>
      <Switch>
        {/* Standard */}
        <Route exact path={ROUTES.login} component={Login} />
        <Route exact path={ROUTES.signup} component={Signup} />
        <Route exact path={ROUTES.forgotPassword} component={ForgotPassword} />

        {/* Private */}
        <PrivateRoute exact path={ROUTES.home} component={Homepage} />
        <PrivateRoute exact path={ROUTES.profile} component={Profile} />

        {/* Default */}
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  );
};

// TODO:
// Maybe the way to do it is...
//  Create a provider,
//    containing `onSnapshot` listeners,
//    which will update the store.
// :/
