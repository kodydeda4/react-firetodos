import { action, Action, computed, Computed, Thunk, thunk } from "easy-peasy";
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
  where,
} from "firebase/firestore";
import { auth, firestore } from "../../config/firebase";
import Todo from "../../types/Todo";

interface UserState {
  // user?: User;
  hasPremium: boolean;
  todos: Todo[];
  search: string;
  todosSearchResults: Computed<this, Todo[]>;
}

interface UserAction {
  setTodos: Action<this, Todo[]>;
  setSearch: Action<this, string>;
  setHasPremium: Action<this, boolean>;
}

interface UserThunks {
  purchasePremium: Thunk<this>;
  createTodo: Thunk<this>;
  deleteTodo: Thunk<this, Todo>;
  toggleTodoDone: Thunk<this, Todo>;
  updateTodoText: Thunk<this, { todo: Todo; text: string }>;
  clearAll: Thunk<this>;
  clearDone: Thunk<this>;
}

export interface UserModel extends UserState, UserAction, UserThunks {}

export const userModel: UserModel = {
  // STATE
  // user: undefined,
  hasPremium: false,
  todos: [],
  search: "",
  todosSearchResults: computed((state) =>
    state.todos.filter((todo) => todo.text.includes(state.search))
  ),

  // ACTION
  setTodos: action((state, payload) => {
    state.todos = payload;
  }),
  setSearch: action((state, payload) => {
    state.search = payload;
  }),
  setHasPremium: action((state, payload) => {
    state.hasPremium = payload;
  }),

  // THUNKS
  purchasePremium: thunk(async (actions, payload, helpers) => {
    await addDoc(
      collection(
        getFirestore(),
        "users",
        getAuth().currentUser!.uid,
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
    await addDoc(firestore.todos2, {
      text: "untitled",
      done: false,
      timestamp: serverTimestamp(),
      userID: auth.currentUser?.uid ?? "",
    });
  }),
  deleteTodo: thunk(async (_, payload) => {
    await deleteDoc(doc(firestore.todos2, payload.id));
  }),
  toggleTodoDone: thunk(async (_, payload) => {
    await updateDoc(doc(firestore.todos2, payload.id), {
      text: payload.text,
      done: !payload.done,
      timestamp: serverTimestamp(),
    });
  }),
  updateTodoText: thunk(async (_, payload) => {
    updateDoc(doc(firestore.todos2, payload.todo.id), {
      text: payload.text,
      done: payload.todo.done,
      timestamp: serverTimestamp(),
    });
  }),
  clearAll: thunk(async () => {
    await getDocs(
      query(
        firestore.todos2,
        where("userID", "==", auth.currentUser?.uid ?? "")
      )
    ).then((snapshot) => {
      snapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(firestore.todos2, document.id));
      });
    });
  }),
  clearDone: thunk(async () => {
    await getDocs(
      query(
        firestore.todos2,
        where("userID", "==", auth.currentUser?.uid ?? ""),
        where("done", "==", true)
      )
    ).then((snapshot) => {
      snapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(firestore.todos2, document.id));
      });
    });
  }),
};
