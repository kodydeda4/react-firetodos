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
import {
  clearAll as handleClearAllTodos,
  clearDone as handleClearDoneTodos,
  createTodo as handleCreateTodo,
  toggleDone as handleUpdateTodoDone,
  updateTodoText as handleUpdateTodoText,
  useTodosSnapshot,
} from "../helpers/todos";
import Todo from "../types/Todo";

export default function FireTodos() {
  const todos = useTodosSnapshot();

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
                  onClick={() => handleCreateTodo()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
                <Button
                  onClick={() => handleClearAllTodos()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => handleClearDoneTodos()}
                  color="inherit"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                >
                  Clear Done
                </Button>
                <Button
                  // onClick={() => viewStore.action.logout()}
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
          {todos.map((todo: Todo) => (
            <ListItem>
              <Checkbox
                onClick={() => handleUpdateTodoDone(todo)}
                edge="start"
                checked={todo.done}
              />
              <TextField
                placeholder={todo.text}
                autoFocus
                variant="standard"
                fullWidth
                onChange={(event) => handleUpdateTodoText(todo, event.target.value)}
              />
              {/* {todo.text} {todo.id} */}
            </ListItem>
          ))}
        </Container>
      </List>
    </>
  );
}