import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import ROUTES from "../../../routes";
import { storeHooks } from "../../../store";
import AuthHeader from "../../AuthHeader";

export default function Login() {
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
            Log In
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
              // error={viewStore.state.alert.type == LoginAlertError.email }
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => viewStore.actions.signIn()}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to={ROUTES.forgotPassword}
                  variant="body2"
                >
                  {"Forgot Password?"}
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to={ROUTES.signup} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8, mb: 4 }}
        >
          {"Copyright © "}
          <Link color="inherit" href="https://material-ui.com/">
            Your Website
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </>
  );
}
