import {
  addDoc,
  collection,
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
import { stringify } from "querystring";
import React, { useEffect } from "react";
import { firestore } from "../config/firebase";
import Color from "../types/Color";
import color from "../types/Color";

export default function Colors() {
  const [colors, setColors] = React.useState<color[]>([]);
  const queryText = "3";

  useEffect(() => {
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
      <button onClick={() => addColor(`${colors.length}`, "pink")}>New</button>
      <button onClick={() => queryDelete(queryText)}>
        Delete all named "{queryText}"
      </button>
      <ul>
        {colors.map((color: Color) => (
          <li key={color.id}>
            <button
              onClick={() =>
                updateColor2({ id: color.id, name: "a", value: "purple" })
              }
            >
              edit
            </button>
            <button onClick={() => deleteColor(color.id)}>delete</button>
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

const addColor = async (name: string, value: string) =>
  await addDoc(firestore.colors, { name, value, timestamp: serverTimestamp() });

const deleteColor = async (id: string) =>
  await deleteDoc(doc(firestore.colors, id));

const updateColor2 = async (props: {
  id: string;
  name: string;
  value: string;
}) => {
  const id = props.id;
  const name = props.name;
  const value = props.value;

  updateDoc(doc(firestore.colors, id), {
    name,
    value,
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
