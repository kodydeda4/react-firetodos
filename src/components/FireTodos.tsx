import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { firestore } from "../config/firebase";
import Todo from "../types/Todo";

export default function FireTodos() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const queryText = "3";

  const updateTodos = useEffect(() => {
    onSnapshot(
      query(firestore.todos2, orderBy("timestamp", "desc")),
      (snapshot) =>
        setTodos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
    );
  }, []);

  return (
    <>
      <button onClick={() => addTodo()}>New</button>
      <button onClick={() => clearDone()}>Clear Done</button>
      <button onClick={() => clearAll()}>Clear All</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            <button onClick={() => updateTodo(todo)}>edit</button>
            <button onClick={() => deleteTodo(todo)}>delete</button>
            <span
              style={{
                height: 15,
                width: 15,
                margin: "0px 10px",
                backgroundColor: todo.done ? "green" : "red",
                borderRadius: "50%",
                display: "inline-block",
              }}
            ></span>
            {todo.text} {todo.id}
          </li>
        ))}
      </ul>
    </>
  );
}

// -----------------------------------------------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------------------------------------------
const addTodo = async () => {
  await addDoc(firestore.todos2, {
    text: "untitled",
    done: false,
    timestamp: serverTimestamp(),
  });
};

const deleteTodo = async (todo: Todo) => {
  await deleteDoc(doc(firestore.todos2, todo.id));
};

const updateTodo = async (todo: Todo) => {
  updateDoc(doc(firestore.todos2, todo.id), {
    text: "updated",
    done: true,
    timestamp: serverTimestamp(),
  });
};

const clearDone = async () => {
  const snapshot = await getDocs(
    query(firestore.todos2, where("done", "==", true))
  );

  snapshot.docs
    .map((doc) => doc.id)
    .forEach(async (id) => await deleteDoc(doc(firestore.todos2, id)));
};

const clearAll = async () => {
  const snapshot = await getDocs(firestore.todos2);

  snapshot.docs
    .map((doc) => doc.id)
    .forEach(async (id) => await deleteDoc(doc(firestore.todos2, id)));
};
