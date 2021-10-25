import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from "@firebase/auth";
import { addDoc, getFirestore } from "@firebase/firestore";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { collection, onSnapshot } from "firebase/firestore";
import { auth } from "../../config/firebase";
import { AlertState, Severity } from "../../types/AlertState";

interface AuthState {
  user?: User;
  alert?: AlertState;
  email: string;
  password: string;
  hasPremium: boolean;
}

interface AuthAction {
  setUser: Action<this, User | undefined>;
  setAlert: Action<this, AlertState | undefined>;
  setEmail: Action<this, string>;
  setPassword: Action<this, string>;
  setHasPremium: Action<this, boolean>;
}

interface AuthThunk {
  signUp: Thunk<this>;
  signIn: Thunk<this>;
  signOut: Thunk<this>;
  purchasePremium: Thunk<this>;
}

export interface AuthModel extends AuthState, AuthAction, AuthThunk {}

export const authModel: AuthModel = {
  // STATE
  user: undefined,
  alert: undefined,
  email: "",
  password: "",
  hasPremium: false,

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
  setHasPremium: action((state, payload) => {
    state.hasPremium = payload;
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
  purchasePremium: thunk(async (actions, payload, helpers) => {
    await addDoc(
      collection(
        getFirestore(),
        "users",
        
        helpers.getState().user!.uid,
        "checkout_sessions"
      ),
      {
        mode: "payment",
        price: "price_1Jo8SSJFfPBKehtVRw32DOjA",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    ).then((doc) => {
      onSnapshot(doc, (snapshot) => {
        const url = snapshot.data()?.url;

        if (url) {
          window.location.assign(url);
        } else {
          console.log("error");
        }
      });
    });
  }),
};
