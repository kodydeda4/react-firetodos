import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import ROUTES from "../../../routes";
import { storeHooks } from "../../../store";
import AuthHeader from "../../AuthHeader";

export default function Signup() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state),
    actions: storeHooks.useStoreActions((action) => action),
  };

  if (viewStore.state.user) {
    return <Redirect to={ROUTES.home} push={true} />;
  }

  return (
    <>
      <AuthHeader />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box sx={{ mt: 1 }}>
            {viewStore.state.alert && (
              <Alert severity={viewStore.state.alert.severity}>
                {viewStore.state.alert.message}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              onChange={(event) =>
                viewStore.actions.setEmail(event.target.value)
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={(event) =>
                viewStore.actions.setPassword(event.target.value)
              }
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => viewStore.actions.signUp()}
            >
              Sign Up
            </Button>
            <Link component={RouterLink} to={ROUTES.login} variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8, mb: 4 }}
        >
          {"Created by "}
          <Link color="inherit" href="https://kodydeda.netlify.app">
            Kody Deda
          </Link>
        </Typography>
      </Container>
    </>
  );
}
