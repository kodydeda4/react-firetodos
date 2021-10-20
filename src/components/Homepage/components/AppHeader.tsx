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

export default AppHeader

function AppHeader() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  const [modal, setModal] = React.useState(false);
  const signOutAction = storeHooks.useStoreActions((action) => action.authModel.signOut);

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
                    () => setModal(true)
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
      <ModalView
        open={modal}
        onClose={() => setModal(false)}
        cancel={() => setModal(false)}
        confirm={() => signOutAction()}
      />
    </>
  );
}

type ModalViewProps = {
  open: boolean;
  onClose: () => void;
  cancel: () => void;
  confirm: () => void;
};

const ModalView = (props: ModalViewProps) => {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ pb: 3 }}
        >
          Are you sure?
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button onClick={() => props.onClose()} variant="contained">
            Cancel
          </Button>
          <Button onClick={() => props.confirm()} variant="contained">
            Log Out
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
