import { FieldValue } from "firebase/firestore";

type Todo = {
  id?: string;
  timestamp?: FieldValue;
  text: string;
  done: boolean;
};

export default Todo;
