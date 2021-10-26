import { User } from "firebase/auth";
import {
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { useEffect } from "react";
import { firestore } from "../config/firebase";
import Todo from "../types/Todo";

export const useUpdateTodos = (props: {
  user: User | null;
  setter: (todos: Todo[]) => void;
}) => {
  useEffect(
    () =>
      onSnapshot(
        query(
          firestore.todos2,
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