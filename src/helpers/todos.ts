import {
  addDoc,
  deleteDoc,
  doc,
  FieldValue,
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

export const useTodosSnapshot = (): Todo[] => {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const update = React.useEffect(() => {
    onSnapshot(query(firestore.todos2), (snapshot) => {
      setTodos(
        snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
    });
  }, []);

  return todos;
};

export const createTodo = async () => {
  const todoPayload: Todo = {
    text: "untitled",
    done: false,
    timestamp: serverTimestamp(),
  };
  await addDoc(firestore.todos2, todoPayload);
};

export const deleteTodo = async (todo: Todo) => {
  await deleteDoc(doc(firestore.todos2, todo.id));
};

export const toggleDone = async (todo: Todo) => {
  const todoPayload: Todo = {
    text: todo.text,
    done: !todo.done,
    timestamp: serverTimestamp(),
  };
  updateDoc(doc(firestore.todos2, todo.id), todoPayload);
};

export const updateTodoText = async (todo: Todo, text: string) => {
  const todoPayload: Todo = {
    text: text,
    done: todo.done,
    timestamp: serverTimestamp(),
  };
  updateDoc(doc(firestore.todos2, todo.id), todoPayload);
};

export const clearDone = async () => {
  await getDocs(query(firestore.todos2, where("done", "==", true))).then(
    (snapshot) => {
      snapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(firestore.todos2, document.id));
      });
    }
  );
};

export const clearAll = async () => {
  await getDocs(firestore.todos2).then((snapshot) => {
    snapshot.docs.forEach(async (document) => {
      await deleteDoc(doc(firestore.todos2, document.id));
    });
  });
};
