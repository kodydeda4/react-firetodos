import { Button, Container, Stack, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../../config/firebase";
import ROUTES from "../../../routes";
import { storeHooks } from "../../../store";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AppHeader() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const signOutAction = storeHooks.useStoreActions(
    (action) => action.authModel.signOut
  );

  return (
    <>
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
                <Button
                  onClick={
                    // () => signOutAction()
                    () => handleOpen()
                  }
                  color="error"
                >
                  Logout
                </Button>
                <Button component={RouterLink} to={ROUTES.home}>
                  Todos
                </Button>
                <Button component={RouterLink} to={ROUTES.profile}>
                  Profile
                </Button>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure?
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button onClick={() => handleClose()} variant="contained">
              Cancel
            </Button>
            <Button onClick={() => signOutAction()} variant="contained">
              Log Out
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
