import {
  collection,
  getFirestore, onSnapshot,
  query
} from "firebase/firestore";
import { useEffect } from "react";
import { stripeConfig } from "../../config/stripe";
import { storeHooks } from "../../store";
import ProfileAppHeader from "./ProfileAppHeader";
import ProfileView from "./ProfileView";

export default function Profile() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.authModel),
    actions: storeHooks.useStoreActions((action) => action.authModel),
  };

  // set has premium
  useEffect(() => {
    onSnapshot(
      query(
        collection(
          getFirestore(),
          "users",
          viewStore.state.user!.uid,
          "payments"
        )
      ),
      (snapshot) => {
        const priceIDs = snapshot.docs.flatMap((doc) => {
          const items = doc.data().items;
          const prices = items.map((item: any) => item.price);
          const ids = prices.map((price: any) => price.id);
          return ids;
        });
        viewStore.actions.setHasPremium(
          priceIDs.includes(stripeConfig.prices.premium)
        );
      }
    );
  }, []);

  return (
    <>
      <ProfileAppHeader />
      <ProfileView />
    </>
  );
}