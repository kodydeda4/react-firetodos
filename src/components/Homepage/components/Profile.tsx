import { Button, Container } from "@mui/material";
import { storeHooks } from "../../../store";
import ProfileAppHeader from "./ProfileAppHeader";

export default function Profile() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  return (
    <>
      <ProfileAppHeader />
      <Container>
        <Button
          variant="contained"
          onClick={() => viewStore.actions.togglePremium()}
        >
          {viewStore.state.isPremiumUser ? "cancel subscription" : "buy premium"}
        </Button>
      </Container>
    </>
  );
}
