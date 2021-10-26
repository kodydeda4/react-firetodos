import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Checkbox,
  Container,
  CssBaseline,
  List,
  ListItem,
  TextField,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { firestore } from "../../config/firebase";
import { storeHooks } from "../../store";
import Todo from "../../types/Todo";

export default function TodosList() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.userModel),
    actions: storeHooks.useStoreActions((action) => action.userModel),
  };

  const user = storeHooks.useStoreState((state) => state.authModel.user);

  useEffect(() => {
    onSnapshot(
      query(firestore.todos2, where("userID", "==", user?.uid ?? "")),
      (snapshot) => {
        viewStore.actions.setTodos(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
  }, [user?.uid, viewStore.actions]);

  if (viewStore.state.todosSearchResults.length === 0) {
    return <PlaceholderView/>
  }

  return (
    <List
      sx={{
        bgcolor: "background.paper",
        overflow: "auto",
        height: "500",
      }}
    >
      {viewStore.state.todosSearchResults.map((todo: Todo) => (
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
    </List>
  );
}

function PlaceholderView () {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography color={"gray"} variant="h6">
          No Results...
        </Typography>
      </Box>
    </Container>
  );
};