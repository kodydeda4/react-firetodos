import { Button, Container, Stack, Toolbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { auth } from "../../config/firebase";
import { storeHooks } from "../../store";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import ROUTES from "../../routes";
import { Link } from "react-router-dom";

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
              {/* <Button onClick={() => {}} color="inherit">
                Profile
              </Button> */}
              <Link to={ROUTES.profile}>Profile</Link>
              <Link to={ROUTES.home}>Todos</Link>

            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

