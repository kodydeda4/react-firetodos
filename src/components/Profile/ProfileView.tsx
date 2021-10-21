import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Container } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { storeHooks } from "../../store";

export default function ProfileView() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.authModel),
    actions: storeHooks.useStoreActions((action) => action.authModel),
  };

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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {viewStore.state.user?.email}
        </Typography>
        <Button
          onClick={() => viewStore.actions.togglePremium()}
          type="submit"
          fullWidth
          variant={viewStore.state.isPremiumUser ? "outlined" : "contained"}
          sx={{ mt: 3 }}
        >
          {viewStore.state.isPremiumUser
            ? "cancel subscription"
            : "buy premium"}
        </Button>
      </Box>
    </Container>
  );
}
