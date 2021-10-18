import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "@firebase/auth";
import { Action, action, createStore, Thunk, thunk } from "easy-peasy";
import { storeHooks } from "..";
import { auth } from "../../config/firebase";
import { AlertState, Severity } from "../../types/AlertState";

interface AuthState {
  user?: User;
  alert?: AlertState;
  email: string;
  password: string;
}

interface AuthAction {
  setUser: Action<this, User | undefined>;
  setAlert: Action<this, AlertState>;
  setEmail: Action<this, string>;
  setPassword: Action<this, string>;
}

interface AuthThunk {
  signUp: Thunk<this>;
  signIn: Thunk<this>;
  signOut: Thunk<this>;
}

export interface AuthModel extends AuthState, AuthAction, AuthThunk {}

export const authModel: AuthModel = {
  // STATE
  user: undefined,
  alert: undefined,
  email: "",
  password: "",

  // ACTION
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setEmail: action((state, payload) => {
    state.email = payload;
  }),
  setPassword: action((state, payload) => {
    state.password = payload;
  }),

  // THUNK
  signUp: thunk(async (actions, payload, { getState }) => {
    await createUserWithEmailAndPassword(
      auth,
      getState().email,
      getState().password
    )
      .then((userCredential) => {
        actions.setAlert({
          severity: Severity.success,
          message: `Successfully created user with email: ${userCredential.user.email}`,
        });
      })
      .catch((error) => {
        actions.setAlert({
          severity: Severity.error,
          message: "Please make sure your email and password are incorrect.",
        });
      });
  }),
  signIn: thunk(async (actions, payload, { getState }) => {
    await signInWithEmailAndPassword(
      auth,
      getState().email,
      getState().password
    )
      .then((userCredential) => {
        actions.setUser(userCredential.user);
      })
      .catch((error) => {
        actions.setAlert({
          severity: Severity.error,
          message: "Please make sure your email and password are incorrect.",
        });
      });
  }),
  signOut: thunk(async (actions) => {
    auth.signOut();
    actions.setUser(undefined);
  }),
  setAlert: action((state, payload) => {
    state.alert = payload;
  }),
};