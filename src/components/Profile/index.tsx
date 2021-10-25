import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useEffect } from "react";
import { auth } from "../../config/firebase";
import { stripeConfig } from "../../config/stripe";
import { storeHooks } from "../../store";
import ProfileAppHeader from "./ProfileAppHeader";
import ProfileView from "./ProfileView";

export default function Profile() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };


  return (
    <>
      <ProfileAppHeader />
      <ProfileView />
    </>
  );
}
