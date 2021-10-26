import AddIcon from "@mui/icons-material/Add";
import { Checkbox, List, ListItem, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { storeHooks } from "../../../store";
import Todo from "../../../types/Todo";
import { Box, Container, CssBaseline, Typography } from "@mui/material";

export default function TodosList() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state),
    actions: storeHooks.useStoreActions((action) => action),
  };

  if (viewStore.state.todosSearchResults.length == 0) {
    return <Placeholder />;
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

const Placeholder = () => {
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
