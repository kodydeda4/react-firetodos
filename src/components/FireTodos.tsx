import { Logout } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { onSnapshot, query } from "firebase/firestore";
import React from "react";
import { firestore } from "../config/firebase";
import useViewStore from "../hooks/useViewStore";
import { TodoStore } from "../store/TodoStore";
import Todo from "../types/Todo";

export default function FireTodos() {
  const todos = useTodosSnapshot();
  const viewStore = useViewStore<TodoStore>();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Container>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Firetodos
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => viewStore.action.createTodo()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
                <Button
                  onClick={() => viewStore.action.clearAll()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => viewStore.action.clearDone()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear Done
                </Button>
                {/* <Button
                  onClick={() => viewStore.action.logout()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<Logout />}
                >
                  Logout
                </Button> */}
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
          {/* {viewStore.state.realTodos.map((todo: Todo) => ( */}
          {todos.map((todo: Todo) => (
            <ListItem>
              <Checkbox
                onClick={() => viewStore.action.toggleDone(todo)}
                edge="start"
                checked={todo.done}
              />
              <TextField
                placeholder={todo.text}
                autoFocus
                variant="standard"
                fullWidth
                onChange={(event) =>
                  viewStore.action.updateText({
                    todo: todo,
                    text: event.target.value,
                  })
                }
              />
              <Button
                onClick={() => viewStore.action.deleteTodo(todo)}
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

export const useTodosSnapshot = (): Todo[] => {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const update = React.useEffect(() => {
    onSnapshot(query(firestore.todos2), (snapshot) => {
      setTodos(
        snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
    });
  }, []);

  return todos;
};
