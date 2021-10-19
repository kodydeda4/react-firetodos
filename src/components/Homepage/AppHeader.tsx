import { Button, Container, Stack, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../config/firebase";
import ROUTES from "../../routes";
import { storeHooks } from "../../store";

export default function AppHeader() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {auth.currentUser?.email}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => viewStore.actions.clearAll()}
                color="inherit"
              >
                Clear All
              </Button>
              <Button
                onClick={() => viewStore.actions.clearDone()}
                color="inherit"
              >
                Clear Done
              </Button>
              <Button onClick={() => auth.signOut()} color="inherit">
                Logout
              </Button>
              <Link to={ROUTES.profile}>Profile</Link>
              <Link to={ROUTES.home}>Todos</Link>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
