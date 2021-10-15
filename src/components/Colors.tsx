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
  const [colors, setColors] = React.useState<color[]>([
    { id: "initial", name: "Loading...", value: "black" },
  ]);

  useEffect(() => {
    const q = query(firestore.colors, orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) =>
      setColors(
        snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      )
    );

    return unsub;
  }, []);

  return (
    <>
      <button onClick={() => handleNew(`${colors.length}`, "pink")}>New</button>
      <button onClick={() => handleQueryDelete()}>Query Delete</button>
      <ul>
        {colors.map((color: Color) => (
          <li key={color.id}>
            <button onClick={() => handleEdit(color.id)}>edit</button>
            <button onClick={() => handleDelete(color.id)}>delete</button>
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

const handleNew = async (name: string, value: string) =>
  await addDoc(firestore.colors, {
    name,
    value,
    timestamp: serverTimestamp(),
  });


const handleEdit = async (id: string) => {
  const name = prompt("Enter color name");
  const value = prompt("Enter color value");

  const docRef = doc(firestore.colors, id);
  const payload = { name, value, timestamp: serverTimestamp() };

  updateDoc(docRef, payload);
};

const handleDelete = async (id: string) =>
  await deleteDoc(doc(firestore.colors, id));

const handleQueryDelete = async () => {
  const userInputName = prompt("Enter color name");

  const q = query(firestore.colors, where("name", "==", userInputName));
  const snapshot = await getDocs(q);

  const results = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  results.forEach(async (result) => {
    const docRef = doc(firestore.colors, result.id);
    await deleteDoc(docRef);
  });
};
