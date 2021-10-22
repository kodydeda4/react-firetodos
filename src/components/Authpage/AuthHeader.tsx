import { Button, Container, Stack, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../../routes";

export default function AuthHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FireTodos
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button color="inherit" component={RouterLink} to={ROUTES.login}>
                Login
              </Button>
              <Button
                // color="inherit"
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
