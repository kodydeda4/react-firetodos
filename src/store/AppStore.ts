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

interface AppState {
  // ======================================================================================================================
  // 🔑 auth
  // ======================================================================================================================
  user?: User;
  alert?: AlertState;

  // ======================================================================================================================
  // ✍🏻todoslist
  // ======================================================================================================================
  todos: Todo[];
  completedTodos: Computed<this, Todo[]>;
}

interface AppAction {
  // ======================================================================================================================
  // 🔑 auth
  // ======================================================================================================================
  login: Action<this, User>;
  logout: Action<this>;
  setAlert: Action<this, AlertState>;
  // ======================================================================================================================
  // ✍🏻 todoslist
  // ======================================================================================================================
  addTodo: Action<this>;
  clearAll: Action<this>;
  toggleDone: Action<this, Todo>;
}

interface AppThunks {
  // ======================================================================================================================
  //🔑 auth
  // ======================================================================================================================
  signin: Thunk<this, { email: string; password: string }>;
  signup: Thunk<this, { email: string; password: string }>;
  signout: Thunk<this>;
  // handleNew: Thunk<this>;
  // handleEdit: Thunk<this, string>;
  // handleDelete: Thunk<this, string>;
}

export interface AppStore extends AppState, AppAction, AppThunks {}

const model: AppStore = {
  // ======================================================================================================================
  //🔑 auth
  // ======================================================================================================================
  user: undefined,
  alert: undefined,
  login: action((state, payload) => {
    state.user = payload;
    state.alert = undefined;
  }),
  logout: action((state) => {
    state.user = undefined;
    state.alert = undefined;
  }),

  signin: thunk(async (actions, payload) => {
    await signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        actions.login(userCredential.user);
        
      })
      .catch((error) => {
        actions.setAlert({
          severity: Severity.error,
          message: 'Please make sure your email and password are incorrect.',
        });
      });
  }),
  signup: thunk(async (actions, payload) => {
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
          message: 'Please make sure your email and password are incorrect.',
        });
      });
  }),
  signout: thunk(async (actions) => {
    auth.signOut();
    actions.logout();
  }),
  setAlert: action((state, payload) => {
    state.alert = payload;
  }),

  // ======================================================================================================================
  //✍🏻 todos
  // ======================================================================================================================
  todos: [],
  completedTodos: computed((state) => state.todos.filter((todo) => todo.done)),
  addTodo: action((state) => {
    state.todos.push({
      id: state.todos.length.toString(),
      text: "untitled",
      done: false,
    });
  }),
  clearAll: action((state) => {
    state.todos = [];
  }),
  toggleDone: action((state, payload) => {
    state.todos.map((todo) => {
      if (todo.id === payload.id) {
        todo.done = !todo.done;
      }
      return todo;
    });
  }),
};

export const appStore = createStore<AppStore>(model);