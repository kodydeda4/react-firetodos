import { Button, Container } from "@mui/material";
import { storeHooks } from "../../../store";
import TodosAppHeader from "./TodosAppHeader";

export default function Profile() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  return (
    <>
      <TodosAppHeader />
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
