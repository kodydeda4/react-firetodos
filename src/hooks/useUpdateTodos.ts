import { User } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { useEffect } from "react";
import Todo from "../types/Todo";

export const useUpdateTodos = (props: {
  user: User | null;
  setter: (todos: Todo[]) => void;
}) => {
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(getFirestore(), "todos2"),
          where("userID", "==", props.user?.uid ?? "...")
        ),
        (snapshot) => {
          props.setter(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          );
          console.log(snapshot);
        }
      ),
    [props.user]
  );
};