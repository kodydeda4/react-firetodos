import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from "@firebase/auth";
import { Action, action, Thunk, thunk } from "easy-peasy";
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
  setAlert: Action<this, AlertState | undefined>;
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
  setAlert: action((state, payload) => {
    state.alert = payload;
  }),
  setEmail: action((state, payload) => {
    state.email = payload;
  }),
  setPassword: action((state, payload) => {
    state.password = payload;
  }),

  // THUNK
  signUp: thunk(async (actions, _, helpers) => {
    await createUserWithEmailAndPassword(
      auth,
      helpers.getState().email,
      helpers.getState().password
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
          message: "A user with that email already exists.",
        });
      });
  }),
  signIn: thunk(async (actions, _, helpers) => {
    await signInWithEmailAndPassword(
      auth,
      helpers.getState().email,
      helpers.getState().password
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
    actions.setAlert(undefined);
    actions.setEmail("");
    actions.setPassword("");
  }),
};