import { Button, Container, Stack, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../../routes";
import { storeHooks } from "../../store";

export default function AuthHeader() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.authModel),
    actions: storeHooks.useStoreActions((action) => action.authModel),
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FireTodos
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button component={RouterLink} to={ROUTES.login}>
                Login
              </Button>
              <Button
                component={RouterLink}
                to={ROUTES.signup}
                variant="contained"
              >
                Sign up
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
