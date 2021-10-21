import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../../routes";
import { storeHooks } from "../../store";
import { ModalView } from "../_helpers/ModalView";

export default function TodosHeader() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  const signOutAction = storeHooks.useStoreActions((action) => action.authModel.signOut);
  
  // @State
  const [logoutModal, setLogoutModal] = useState(false);
  const [clearAllModal, setClearAllModal] = useState(false);
  const [profileMenu, setProfileMenu] = useState<null | HTMLElement>(null);

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
          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(event) => viewStore.actions.setSearch(event.target.value)}
              placeholder="Search…"
            />
          </Search>
          <IconButton
            onClick={() => viewStore.actions.createTodo()}
            size="large"
            color="inherit"
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() => setClearAllModal(true)}
            size="large"
            color="inherit"
          >
            <DeleteIcon />
          </IconButton>
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
            action: () => signOutAction(),
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

// Search ____________________________________________________________________________________________

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
