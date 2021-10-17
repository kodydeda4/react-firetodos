import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "@firebase/auth";
import {
  Action,
  action,
  Computed,
  computed,
  createStore, Thunk,
  thunk
} from "easy-peasy";
import { auth } from "../config/firebase";
import { AlertState, Severity } from "../types/AlertState";
import Todo from "../types/Todo";

interface TodoState {

}

interface TodoAction {

}

interface TodoThunks {

}

export interface TodoStore extends TodoState, TodoAction, TodoThunks {}

export const todoStore: TodoStore = createStore<TodoStore>({

});
