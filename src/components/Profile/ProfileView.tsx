import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Container } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { storeHooks } from "../../store";
import { Link as RouterLink } from "react-router-dom";
import { addDoc, getFirestore, onSnapshot } from "@firebase/firestore";
import { collection, doc } from "firebase/firestore";

export default function ProfileView() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.authModel),
    actions: storeHooks.useStoreActions((action) => action.authModel),
  };

  const handleSubmit = async () => {
    // const fstore = getFirestore();

    const uid = viewStore.state.user?.uid!;
    const c = collection(getFirestore(), "users", uid, "checkout_sessions");
    const d = await addDoc(c, {
      mode: "payment",
      price: "price_1Jo8SSJFfPBKehtVRw32DOjA",
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    })

    onSnapshot(d, (snap) => {
      const url = snap.data()?.url

      console.log(`${url}`)
      // const { error, url } = snap.data();
      // if (error) {
      //   // Show an error to your customer and 
      //   // inspect your Cloud Function logs in the Firebase console.
      //   alert(`An error occured: ${error.message}`);
      // }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      }
    });


    // useEffect(() => {
    //   onSnapshot(
    //     query(firestore.todos2, where("userID", "==", user?.uid ?? "")),
    //     (snapshot) => {
    //       viewStore.actions.setTodos(
    //         snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
    //       );
    //     }
    //   );
    // }, [user?.uid, viewStore.actions]);
  
    

    // const docRef = await getFirestore
    //   .collection("customers")
    //   .doc(currentUser.uid)
    //   .collection("checkout_sessions")
    //   .add({
    //     mode: "payment",
    //     price: "price_1GqIC8HYgolSBA35zoTTN2Zl", // One-time price created in Stripe
    //     success_url: window.location.origin,
    //     cancel_url: window.location.origin,
    //   });

    //   .then(async (userCredential) => {
    // // const u = userCredential.user.uid
    // // const c = collection(firestore.users, u, "checkout_sessions")
    // // const d = await addDoc(c, {
    // //   price: process.env.REACT_APP_STRIPE_PRODUCT_PRICE,
    // //   success_url: window.location.origin,
    // //   cancel_url: window.location.origin,
    // // });
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

        {/* <a target="_blank" href="https://buy.stripe.com/test_aEUfZp60V6Lw9k4aEE">purchase premium</a> */}
      </Box>
    </Container>
  );
}

// 18:30
// https://www.youtube.com/watch?v=5rc0pe2qRjg
