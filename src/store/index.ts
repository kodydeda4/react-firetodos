import { createStore, createTypedHooks, persist } from "easy-peasy";
import { AuthModel, authModel } from "./models/AuthModel";
import { UserModel, userModel } from "./models/UserModel";

interface Model {
  authModel: AuthModel;
  userModel: UserModel;
}

const model: Model = {
  authModel: authModel,
  userModel: userModel,
};

export const store = createStore(persist(model));
// export const store = createStore(model);
export const storeHooks = createTypedHooks<Model>();