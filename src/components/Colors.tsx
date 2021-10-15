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
  where
} from "firebase/firestore";
import React, { useEffect } from "react";
import { COLLECTIONS, firestore } from "../config/firebase";
import color from "../types/Color";

export default function Colors() {
  const [colors, setColors] = React.useState<color[]>([
    { id: "initial", name: "Loading...", value: "black" },
  ]);

  useEffect(() => {
    const q = query(COLORS, orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot: any) =>
      setColors(
        snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      )
    );

    return unsub;
  }, []);

  return (
    <>
      <button onClick={() => handleNew()}>New</button>
      <button onClick={() => handleQueryDelete()}>Query Delete</button>
      <ul>
        {colors.map((color) => (
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

const COLORS = collection(firestore, COLLECTIONS.colors)

const handleNew = async () => {
  const name = prompt("Enter color name");
  const value = prompt("Enter color value");

  const payload = { name, value, timestamp: serverTimestamp() };

  const docRef = await addDoc(COLORS, payload);
  console.log("The new ID is: " + docRef.id);
};

const handleEdit = async (id: any) => {
  const name = prompt("Enter color name");
  const value = prompt("Enter color value");

  const docRef = doc(COLORS, id);
  const payload = { name, value, timestamp: serverTimestamp() };

  updateDoc(docRef, payload);
};

const handleDelete = async (id: any) => {
  const docRef = doc(COLORS, id);
  await deleteDoc(docRef);
};

const handleQueryDelete = async () => {
  const userInputName = prompt("Enter color name");

  const q = query(COLORS, where("name", "==", userInputName));
  const snapshot = await getDocs(q);

  const results = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  results.forEach(async (result) => {
    const docRef = doc(COLORS, result.id);
    await deleteDoc(docRef);
  });
};
