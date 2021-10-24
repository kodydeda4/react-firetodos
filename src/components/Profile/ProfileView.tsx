import { addDoc, getFirestore, onSnapshot } from "@firebase/firestore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Container } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import * as React from "react";
import { auth } from "../../config/firebase";
import { storeHooks } from "../../store";
import { firestore } from "../../config/firebase";

export default function ProfileView() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.authModel),
    actions: storeHooks.useStoreActions((action) => action.authModel),
  };

  async function getCustomClaimRole() {
    await auth.currentUser!.getIdToken(true);
    const decodedToken = await auth.currentUser!.getIdTokenResult();
    const stripeRoleR = decodedToken.claims.stripeRole;
    console.log(`${decodedToken}`);
    console.log(`${stripeRoleR}`);
  }

  async function getHasPremium() {
    await getDocs(
      query(
        collection(
          getFirestore(),
          "users",
          viewStore.state.user!.uid,
          "payments"
        ),
        where("status", "==", "succeeded")
      )
    ).then((snapshot) => snapshot.docs.length > 0);
  }

  const purchasePremium = async () => {
    await addDoc(
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
    ).then((doc) => {
      onSnapshot(doc, (snapshot) => {
        const url = snapshot.data()?.url;

        if (url) {
          window.location.assign(url);
        } else {
          console.log("error");
        }
      });
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
          onClick={purchasePremium}
          type="submit"
          fullWidth
          variant={viewStore.state.isPremiumUser ? "outlined" : "contained"}
          sx={{ mt: 3 }}
        >
          Buy premium
        </Button>
        <Button
          onClick={getHasPremium}
          type="submit"
          fullWidth
          variant={viewStore.state.isPremiumUser ? "outlined" : "contained"}
          sx={{ mt: 3 }}
        >
          getCustomClaimRole
        </Button>
      </Box>
    </Container>
  );
}
