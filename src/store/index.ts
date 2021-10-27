import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "@firebase/auth";
import {
  action,
  Action,
  computed,
  Computed,
  createStore,
  createTypedHooks, Thunk,
  thunk
} from "easy-peasy";
import { getAuth, User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { app } from "../config/firebase";
import { stripeConfig } from "../config/stripe";
import { AlertState, Severity } from "../types/AlertState";
import Todo from "../types/Todo";

interface ModelState {
  user: User | null;
  email: string;
  password: string;
  alert: AlertState | null;
  premium: boolean;
  todos: Todo[];
  search: string;
  todosSearchResults: Computed<this, Todo[]>;
}

interface ModelAction {
  setUser: Action<this, User | null>;
  setAlert: Action<this, AlertState | null>;
  setEmail: Action<this, string>;
  setPassword: Action<this, string>;
  setTodos: Action<this, Todo[]>;
  setSearch: Action<this, string>;
  setHasPremium: Action<this, boolean>;
}

interface ModelThunks {
  signUp: Thunk<this>;
  signIn: Thunk<this>;
  signOut: Thunk<this>;
  purchasePremium: Thunk<this>;
  createTodo: Thunk<this>;
  deleteTodo: Thunk<this, Todo>;
  toggleTodoDone: Thunk<this, Todo>;
  updateTodoText: Thunk<this, { todo: Todo; text: string }>;
  clearAllTodos: Thunk<this>;
  clearDoneTodos: Thunk<this>;
  updateTodos: Thunk<this>;
  updatePremium: Thunk<this>;
}

export interface Model extends ModelState, ModelAction, ModelThunks {}

export const model: Model = {
  // STATE
  user: null,
  alert: null,
  email: "",
  password: "",
  premium: false,
  todos: [],
  search: "",
  todosSearchResults: computed((state) =>
    state.search.length > 0
      ? state.todos.filter((todo) => todo.text.includes(state.search))
      : state.todos
  ),

  // ACTION
  setUser: action((state, payload) => { state.user = payload }),
  setAlert: action((state, payload) => { state.alert = payload }),
  setEmail: action((state, payload) => { state.email = payload }),
  setPassword: action((state, payload) => { state.password = payload }),
  setTodos: action((state, payload) => { state.todos = payload }),
  setSearch: action((state, payload) => { state.search = payload }),
  setHasPremium: action((state, payload) => { state.premium = payload }),

  // THUNKS
  signUp: thunk(async (actions, _, helpers) => {
    await createUserWithEmailAndPassword(
      getAuth(app),
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
          message: "The email or password you provided cannot be used.",
        });
      });
  }),
  signIn: thunk(async (actions, _, helpers) => {
    await signInWithEmailAndPassword(
      getAuth(app),
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
    getAuth(app).signOut();
    actions.setUser(null);
    actions.setAlert(null);
    actions.setEmail("");
    actions.setPassword("");
  }),
  purchasePremium: thunk(async () => {
    await addDoc(
      collection(
        getFirestore(),
        "users",
        getAuth(app).currentUser!.uid,
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
  createTodo: thunk(async () => {
    await addDoc(collection(getFirestore(), "todos"), {
      text: "untitled",
      done: false,
      timestamp: serverTimestamp(),
      userID: getAuth(app).currentUser?.uid ?? "",
    });
  }),
  deleteTodo: thunk(async (_, payload) => {
    await deleteDoc(doc(collection(getFirestore(), "todos"), payload.id));
  }),
  toggleTodoDone: thunk(async (_, payload) => {
    await updateDoc(doc(collection(getFirestore(), "todos"), payload.id), {
      text: payload.text,
      done: !payload.done,
      timestamp: serverTimestamp(),
    });
  }),
  updateTodoText: thunk(async (_, payload) => {
    updateDoc(doc(collection(getFirestore(), "todos"), payload.todo.id), {
      text: payload.text,
      done: payload.todo.done,
      timestamp: serverTimestamp(),
    });
  }),
  clearAllTodos: thunk(async () => {
    await getDocs(
      query(
        collection(getFirestore(), "todos"),
        where("userID", "==", getAuth(app).currentUser?.uid ?? "")
      )
    ).then((snapshot) => {
      snapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(collection(getFirestore(), "todos"), document.id));
      });
    });
  }),
  clearDoneTodos: thunk(async () => {
    await getDocs(
      query(
        collection(getFirestore(), "todos"),
        where("userID", "==", getAuth(app).currentUser?.uid ?? ""),
        where("done", "==", true)
      )
    ).then((snapshot) => {
      snapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(collection(getFirestore(), "todos"), document.id));
      });
    });
  }),
  updateTodos: thunk(async (actions) => {
    onSnapshot(
      query(
        collection(getFirestore(), "todos"),
        where("userID", "==", getAuth().currentUser?.uid ?? "...")
      ),
      (snapshot) => {
        actions.setTodos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        );
        console.log(snapshot);
      }
    );
  }),
  updatePremium: thunk(async (actions) => {
    onSnapshot(
      query(
        collection(
          getFirestore(),
          "users",
          getAuth().currentUser?.uid ?? "...",
          "payments"
        )
      ),
      (snapshot) =>
        actions.setHasPremium(
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
    );
  }),
};

// export const store = createStore(persist(model));
export const store = createStore(model);
export const storeHooks = createTypedHooks<Model>();
