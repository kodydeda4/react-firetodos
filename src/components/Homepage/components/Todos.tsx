import { User } from "@firebase/auth";
import AddIcon from "@mui/icons-material/Add";
import {
  Checkbox,
  Container,
  List,
  ListItem, TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import { onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { firestore } from "../../../config/firebase";
import { storeHooks } from "../../../store";
import Todo from "../../../types/Todo";
import AppHeader from "./AppHeader";
import BottomAppBar from "./BottomAppbar";

export default function Homepage() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  // ------------------------------------------------------------------------
  const user = storeHooks.useStoreState((state) => state.authModel.user);
  const todos = useTodosSnapshot(user!);
  // ------------------------------------------------------------------------

  return (
    <>
      <AppHeader />
      <List
        sx={{
          bgcolor: "background.paper",
          overflow: "auto",
          // height: "100vh",
          height: "500",
        }}
      >
        <Container>
          {/* {viewStore.state.todos.map((todo: Todo) => ( */}
          {todos.map((todo: Todo) => (
            <ListItem>
              <Checkbox
                onClick={() => viewStore.actions.toggleTodoDone(todo)}
                edge="start"
                checked={todo.done}
              />
              <TextField
                placeholder={todo.text}
                autoFocus
                variant="standard"
                fullWidth
                onChange={(event) =>
                  viewStore.actions.updateTodoText({
                    todo: todo,
                    text: event.target.value,
                  })
                }
              />
              <Button
                onClick={() => viewStore.actions.deleteTodo(todo)}
                color="inherit"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </Container>
      </List>
      <BottomAppBar />
    </>
  );
}

export const useTodosSnapshot = (user: User | null): Todo[] => {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const update = React.useEffect(() => {
    onSnapshot(
      query(firestore.todos2, where("userID", "==", user?.uid ?? "")),
      (snapshot) => {
        setTodos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
  }, []);

  return todos;
};