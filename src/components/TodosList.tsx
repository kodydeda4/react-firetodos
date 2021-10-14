import { Logout } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Checkbox,
  Container,
  List,
  ListItem,
  Stack,
  TextField
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Redirect } from "react-router-dom";
import useViewStore from "../hooks/useViewStore";
import ROUTES from "../routes";
import { AppStore } from "../store/App";

export default function TodosList() {
  const viewStore = useViewStore<AppStore>();

  if (!viewStore.state.user) {
    return <Redirect to={ROUTES.login} push={true} />;
  }

  return (
    <>
      <Header />
      <Todos />
    </>
  );
}

const Header = () => {
  const viewStore = useViewStore<AppStore>();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Firetodos
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => viewStore.action.addTodo()}
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
                Clear
              </Button>
              <Button
                onClick={() => viewStore.action.logout()}
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
  );
};

const Todos = () => {
  const viewStore = useViewStore<AppStore>();

  return (
    <List
      sx={{
        bgcolor: "background.paper",
        overflow: "auto",
        height: "100vh",
      }}
    >
      <Container>
        {viewStore.state.todos.map((todo) => (
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
            />
          </ListItem>
        ))}
      </Container>
    </List>
  );
};
