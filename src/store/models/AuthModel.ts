import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from './../../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from "@firebase/auth";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { auth } from "../../config/firebase";
import { AlertState, Severity } from "../../types/AlertState";
import { addDoc, doc, getFirestore } from '@firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

interface AuthState {
  user?: User;
  alert?: AlertState;
  email: string;
  password: string;
  isPremiumUser: boolean;
}

interface AuthAction {
  setUser: Action<this, User | undefined>;
  setAlert: Action<this, AlertState | undefined>;
  setEmail: Action<this, string>;
  setPassword: Action<this, string>;
  togglePremium: Action<this>;
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
  isPremiumUser: false,

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
  togglePremium: action((state) => {
    state.isPremiumUser = !state.isPremiumUser
  }),  
  
  // THUNK
  signUp: thunk(async (actions, payload, { getState }) => {
    await createUserWithEmailAndPassword(
      auth,
      getState().email,
      getState().password
    )
    // .then(async (userCredential) => {
    //   // const u = userCredential.user.uid
    //   // const c = collection(firestore.users, u, "checkout_sessions")
    //   // const d = await addDoc(c, {
    //   //   price: process.env.REACT_APP_STRIPE_PRODUCT_PRICE,
    //   //   success_url: window.location.origin,
    //   //   cancel_url: window.location.origin,
    //   // });
    // })
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
    actions.setAlert(undefined);
    actions.setEmail("");
    actions.setPassword("");
  }),
};
