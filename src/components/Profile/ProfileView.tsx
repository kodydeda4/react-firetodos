import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Container } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { getAuth } from "firebase/auth";
import * as React from "react";
import { auth } from "../../config/firebase";
import { storeHooks } from "../../store";

export default function ProfileView() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.userModel),
    actions: storeHooks.useStoreActions((action) => action.userModel),
  };

  async function getCustomClaimRole() {
    await auth.currentUser!.getIdToken(true);
    const decodedToken = await auth.currentUser!.getIdTokenResult();
    const stripeRoleR = decodedToken.claims.stripeRole;
    console.log(`${decodedToken}`);
    console.log(`${stripeRoleR}`);
  }

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
          {/* {viewStore.state.user?.email} */}
          {getAuth().currentUser?.email}
        </Typography>
        <Button
          disabled={viewStore.state.hasPremium}
          onClick={() => viewStore.actions.purchasePremium()}
          type="submit"
          fullWidth
          variant={viewStore.state.hasPremium ? "outlined" : "contained"}
          sx={{ mt: 3 }}
        >
          Buy premium
        </Button>
        <Button
          onClick={getCustomClaimRole}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Custom Claim Role
        </Button>
      </Box>
    </Container>
  );
}
