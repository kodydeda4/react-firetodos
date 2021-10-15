import { Action, action, Computed, computed, createStore } from "easy-peasy";
import useViewStore from "../hooks/useViewStore";
import Todo from "../types/Todo";

interface ColorState {
  todos: Todo[];
  completedTodos: Computed<this, Todo[]>;
}

interface ColorAction {
  addTodo: Action<this>;
  clearAll: Action<this>;
  toggleDone: Action<this, Todo>;
}

interface ColorThunks {}

export interface ColorStore extends ColorState, ColorAction, ColorThunks {}

export const colorStore = createStore<ColorStore>({
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
});
