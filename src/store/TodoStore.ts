import { auth } from "./../config/firebase";
import { getAdditionalUserInfo, User } from "@firebase/auth";
import { createStore, Thunk, thunk } from "easy-peasy";
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
import { firestore } from "../config/firebase";
import Todo from "../types/Todo";

interface TodoState {
  user: User;
  // todos: Todo[];
}

interface TodoAction {}

interface TodoThunks {
  createTodo: Thunk<this>;
  deleteTodo: Thunk<this, Todo>;
  toggleTodoDone: Thunk<this, Todo>;
  updateTodoText: Thunk<this, { todo: Todo; text: string }>;
  clearAll: Thunk<this>;
  clearDone: Thunk<this>;
}

export interface TodoStore extends TodoState, TodoAction, TodoThunks {}

export const todoStore = createStore<TodoStore>({
  user: auth.currentUser!,
  // todos: [],
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
      query(firestore.todos2, where("userID", "==", getState().user.uid))
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
        where("userID", "==", getState().user.uid),
        where("done", "==", true)
      )
    ).then((snapshot) => {
      snapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(firestore.todos2, document.id));
      });
    });
  }),
});
