import { User } from "@firebase/auth";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Logout from "@mui/icons-material/Logout";
import {
  Checkbox,
  Container,
  List,
  ListItem,
  Stack,
  TextField,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { Redirect } from "react-router-dom";
import { auth, firestore } from "../config/firebase";
import ROUTES from "../routes";
import { storeHooks } from "../store";
import Todo from "../types/Todo";

export default function FireTodos() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  const user = storeHooks.useStoreState((state) => state.authModel.user);
  const signOutAction = storeHooks.useStoreActions(
    (action) => action.authModel.signOut
  );
  const todos = useTodosSnapshot(auth.currentUser);

  if (!user) {
    return <Redirect to={ROUTES.login} push={true} />;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Container>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {user.email}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => viewStore.actions.createTodo()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
                <Button
                  onClick={() => viewStore.actions.clearAll()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => viewStore.actions.clearDone()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear Done
                </Button>
                <Button
                  onClick={() => signOutAction()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<Logout />}
                >
                  Logout
                </Button>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <List
        sx={{
          bgcolor: "background.paper",
          overflow: "auto",
          height: "100vh",
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
    </>
  );
}

export const useTodosSnapshot = (user: User | null): Todo[] => {
  // Should actually check if user exists first but yeah...
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
