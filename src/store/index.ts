import { createStore, createTypedHooks, persist } from "easy-peasy";
import { AuthModel, authModel } from "./models/AuthStore";
import { TodoModel, todoModel } from "./models/TodoStore";

interface Model {
  authModel: AuthModel;
  todoModel: TodoModel;
}

const model: Model = {
  authModel: authModel,
  todoModel: todoModel,
};

export const store = createStore(persist(model));
export const storeHooks = createTypedHooks<Model>();