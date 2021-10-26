import { storeHooks } from "../../store";
import ProfileAppHeader from "./ProfileAppHeader";
import ProfileView from "./ProfileView";

export default function Profile() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.userModel),
    actions: storeHooks.useStoreActions((action) => action.userModel),
  };


  return (
    <>
      <ProfileAppHeader />
      <ProfileView />
    </>
  );
}
