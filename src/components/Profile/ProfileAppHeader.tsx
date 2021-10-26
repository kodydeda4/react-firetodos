import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../../routes";
import { storeHooks } from "../../store";
import { ModalView } from "../_helpers/ModalView";

export default function ProfileAppHeader() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state),
    actions: storeHooks.useStoreActions((action) => action),
  };

  // @State
  const [logoutModal, setLogoutModal] = React.useState(false);
  const [clearAllModal, setClearAllModal] = React.useState(false);
  const [profileMenu, setProfileMenu] = React.useState<null | HTMLElement>(
    null
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            component={RouterLink}
            to={ROUTES.home}
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            FireTodos
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            size="large"
            edge="end"
            onClick={(event) => setProfileMenu(event.currentTarget)}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MenuView
        isPresented={profileMenu}
        onDismiss={() => setProfileMenu(null)}
        onLogoutButtonTapped={() => setLogoutModal(true)}
      />
      <ModalView
        isPresented={logoutModal}
        onDismiss={() => setLogoutModal(false)}
        modalState={{
          title: "Log out?",
          cancel: {
            text: "Cancel",
            action: () => setLogoutModal(false),
          },
          confirm: {
            text: "Logout",
            action: () => viewStore.actions.signOut(),
          },
        }}
      />
      <ModalView
        isPresented={clearAllModal}
        onDismiss={() => setClearAllModal(false)}
        modalState={{
          title: "Clear All?",
          cancel: {
            text: "Cancel",
            action: () => setClearAllModal(false),
          },
          confirm: {
            text: "Yes",
            action: () => viewStore.actions.clearAll(),
          },
        }}
      />
    </>
  );
}

// Menu ____________________________________________________________________________________________

function MenuView(props: {
  isPresented: Element | ((element: Element) => Element) | null | undefined;
  onDismiss: () => void;
  onLogoutButtonTapped: () => void;
}) {
  return (
    <Menu
      anchorEl={props.isPresented}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(props.isPresented)}
      onClose={props.onDismiss}
    >
      <MenuItem
        component={RouterLink}
        to={ROUTES.profile}
        onClick={props.onDismiss}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          props.onDismiss();
          props.onLogoutButtonTapped();
        }}
        sx={{
          color: "red",
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
}