import { User } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query
} from "firebase/firestore";
import { useEffect } from "react";
import { stripeConfig } from "../config/stripe";

export const useUpdatePremium = (props: {
  user: User | null;
  setter: (hasPremium: boolean) => void;
}) => {
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(
            getFirestore(),
            "users",
            props.user?.uid ?? "...",
            "payments"
          )
        ),
        (snapshot) =>
          props.setter(
            snapshot.docs
              .flatMap((doc) => {
                if (doc.data().items) {
                  return doc
                    .data()
                    .items.map((item: any) => item.price)
                    .map((price: any) => price.id);
                }
                return [];
              })
              .includes(stripeConfig.prices.premium)
          )
      ),
    [props.user]
  );
};