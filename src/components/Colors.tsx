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
  where
} from "firebase/firestore";
import React, { useEffect } from "react";
import { firestore } from "../config/firebase";
import { default as Color } from "../types/Color";

export default function Colors() {
  const [colors, setColors] = React.useState<Color[]>([]);
  const queryText = "3";

  const updateTodos = useEffect(() => {
    onSnapshot(
      query(firestore.colors, orderBy("timestamp", "desc")),
      (snapshot) =>
        setColors(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
    );
  }, []);

  return (
    <>
      <button onClick={() => addColor()}>New</button>
      <button onClick={() => queryDelete(queryText)}>
        Delete all named "{queryText}"
      </button>
      <ul>
        {colors.map((color: Color) => (
          <li key={color.id}>
            <button onClick={() => updateColor(color)}>edit</button>
            <button onClick={() => deleteColor(color)}>delete</button>
            <span
              style={{
                height: 15,
                width: 15,
                margin: "0px 10px",
                backgroundColor: color.value,
                borderRadius: "50%",
                display: "inline-block",
              }}
            ></span>
            {color.name}
          </li>
        ))}
      </ul>
    </>
  );
}

// -----------------------------------------------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------------------------------------------
const addColor = async () => {
  await addDoc(firestore.colors, {
    name: "untitled",
    value: "red",
    timestamp: serverTimestamp(),
  });
};

const deleteColor = async (color: Color) => {
  await deleteDoc(doc(firestore.colors, color.id));
};

const updateColor = async (color: Color) => {
  updateDoc(doc(firestore.colors, color.id), {
    name: "updated",
    value: "green",
    timestamp: serverTimestamp(),
  });
};

const queryDelete = async (name: string) => {
  const snapshot = await getDocs(
    query(firestore.colors, where("name", "==", name))
  );

  snapshot.docs
    .map((doc) => doc.id)
    .forEach(async (id) => await deleteDoc(doc(firestore.colors, id)));
};
