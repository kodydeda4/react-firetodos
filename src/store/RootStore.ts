import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "@firebase/auth";
import { Action, action, createStore, persist, Thunk, thunk } from "easy-peasy";
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import { AlertState, Severity } from "../types/AlertState";
import Todo from "../types/Todo";

interface RootState {
  user?: User;
  alert?: AlertState;
}

interface RootAction {
  // AUTH
  setUser: Action<this, User | undefined>;
  setAlert: Action<this, AlertState>;
}

interface RootThunk {
  // AUTH
  signUp: Thunk<this, { email: string; password: string }>;
  signIn: Thunk<this, { email: string; password: string }>;
  signOut: Thunk<this>;

  // TODO
  createTodo: Thunk<this>;
  deleteTodo: Thunk<this, Todo>;
  toggleTodoDone: Thunk<this, Todo>;
  updateTodoText: Thunk<this, { todo: Todo; text: string }>;
  clearAll: Thunk<this>;
  clearDone: Thunk<this>;
}

export interface RootStore extends RootState, RootAction, RootThunk {}

export const rootStore = createStore<RootStore>(
  persist({
    // AUTH
    user: undefined,
    alert: undefined,
    setUser: action((state, payload) => {
      state.user = payload;
    }),
    signUp: thunk(async (actions, payload) => {
      await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
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

    // TODO
    createTodo: thunk(async (actions, payload, { getState }) => {
      await addDoc(firestore.todos2, {
        text: "untitled",
        done: false,
        timestamp: serverTimestamp(),
        userID: getState().user!.uid,
      });
    }),
    deleteTodo: thunk(async (actions, payload) => {
      await deleteDoc(doc(firestore.todos2, payload.id));
    }),
    toggleTodoDone: thunk(async (actions, payload) => {
      await updateDoc(doc(firestore.todos2, payload.id), {
        text: payload.text,
        done: !payload.done,
        timestamp: serverTimestamp(),
      });
    }),
    updateTodoText: thunk(async (actions, payload) => {
      updateDoc(doc(firestore.todos2, payload.todo.id), {
        text: payload.text,
        done: payload.todo.done,
        timestamp: serverTimestamp(),
      });
    }),
    clearAll: thunk(async (actions, payload, { getState }) => {
      await getDocs(
        query(
          firestore.todos2,
          where("userID", "==", getState().user?.uid ?? "")
        )
      ).then((snapshot) => {
        snapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(firestore.todos2, document.id));
        });
      });
    }),
    clearDone: thunk(async (actions, payload, { getState }) => {
      await getDocs(
        query(
          firestore.todos2,
          where("userID", "==", getState().user?.uid ?? ""),
          where("done", "==", true),
        )
      ).then((snapshot) => {
        snapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(firestore.todos2, document.id));
        });
      });
    }),
  })
);
