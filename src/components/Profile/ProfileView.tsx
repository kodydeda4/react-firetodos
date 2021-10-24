import { addDoc, getFirestore, onSnapshot } from "@firebase/firestore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Container } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { collection } from "firebase/firestore";
import * as React from "react";
import { storeHooks } from "../../store";

export default function ProfileView() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.authModel),
    actions: storeHooks.useStoreActions((action) => action.authModel),
  };

  const handleSubmit = async () => {
    const d = await addDoc(
      collection(
        getFirestore(),
        "users",
        viewStore.state.user?.uid!,
        "checkout_sessions"
      ),
      {
        mode: "payment",
        price: "price_1Jo8SSJFfPBKehtVRw32DOjA",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    onSnapshot(d, (snap) => {
      const url = snap.data()?.url;

      if (url) {
        window.location.assign(url);
      } else {
        console.log("error");
      }
    });
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
          onClick={handleSubmit}
          type="submit"
          fullWidth
          variant={viewStore.state.isPremiumUser ? "outlined" : "contained"}
          sx={{ mt: 3 }}
        >
          Buy premium
        </Button>
      </Box>
    </Container>
  );
}
