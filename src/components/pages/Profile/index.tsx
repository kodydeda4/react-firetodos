import { useEffect } from "react";
import { storeHooks } from "../../../store";
import ProfileBody from "./ProfileBody";
import ProfileHeader from "./ProfileHeader";

export default function Profile() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state),
    actions: storeHooks.useStoreActions((action) => action),
  };

  useEffect(() => viewStore.actions.updatePremium(), [])
  
  return (
    <>
      <ProfileHeader />
      <ProfileBody />
    </>
  );
}
