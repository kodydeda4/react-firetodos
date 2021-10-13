import {
  Action,
  action,
  Computed,
  computed,
  createStore
} from "easy-peasy";

interface AppState {
  todos: Todo[];
  completedTodos: Computed<this, Todo[]>;
}

interface AppAction {
  addTodo: Action<this>;
  clearAll: Action<this>;
  toggleDone: Action<this, Todo>;
}

interface AppThunks {}

export interface AppStore extends AppState, AppAction, AppThunks {}

const model: AppStore = {
  todos: [],
  completedTodos: computed((state) => state.todos.filter((todo) => todo.done)),
  addTodo: action((state) => {
    state.todos.push({
      id: state.todos.length,
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

// ------------------------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------------------------

interface Todo {
  id: number;
  text: string;
  done: boolean;
}
interface Alert {
  severity: Severity;
  message: string;
}

enum Severity {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}
