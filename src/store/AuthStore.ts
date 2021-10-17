import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "@firebase/auth";
import { Action, action, createStore, Thunk, thunk } from "easy-peasy";
import { auth } from "../config/firebase";
import { AlertState, Severity } from "../types/AlertState";

interface AuthState {
  user?: User;
  alert?: AlertState;
}

interface AuthAction {
  setUser: Action<this, User | undefined>;
  setAlert: Action<this, AlertState>;
}

interface AuthThunk {
  signUp: Thunk<this, { email: string; password: string }>;
  signIn: Thunk<this, { email: string; password: string }>;
  signOut: Thunk<this>;
}

export interface AuthStore extends AuthState, AuthAction, AuthThunk {}

export const authStore = createStore<AuthStore>({
  user: undefined,
  alert: undefined,
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  signUp: thunk(async (actions, payload) => {
    await createUserWithEmailAndPassword(auth, payload.email, payload.password)
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
  signIn: thunk(async (actions, payload) => {
    await signInWithEmailAndPassword(auth, payload.email, payload.password)
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
});
