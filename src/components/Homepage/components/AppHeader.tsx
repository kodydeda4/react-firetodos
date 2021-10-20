import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Container, Stack, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import { alpha, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../../config/firebase";
import ROUTES from "../../../routes";
import { storeHooks } from "../../../store";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function AppHeader() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };

  const [modal, setModal] = React.useState(false);

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

const ModalView = (props: {
  open: boolean;
  onClose: () => void;
  cancel: () => void;
  confirm: () => void;
}) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
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

// -------------------------------------------------------------------------------------------------------------------

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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const viewStore = {
    state: storeHooks.useStoreState((state) => state.todoModel),
    actions: storeHooks.useStoreActions((action) => action.todoModel),
  };
  const signOutAction = storeHooks.useStoreActions(
    (action) => action.authModel.signOut
  );

  const [modal, setModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            MUI
          </Typography>

          {/* <Box sx={{ flexGrow: 0 }}/> */}
          <Search sx={{ flexGrow: 1, display: "block" }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" />
          </Search>
          <IconButton size="large" color="inherit">
            <AddIcon />
          </IconButton>
          <IconButton size="large" color="inherit">
            <DeleteIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MyMenu
        isPresented={Boolean(anchorEl)}
        onDismiss={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        onLogoutButtonTapped={() => setModal(true)}
      />
      <ModalView
        open={modal}
        onClose={() => setModal(false)}
        cancel={() => setModal(false)}
        confirm={() => signOutAction()}
      />
    </>
  );
}

function MyMenu(props: {
  isPresented: boolean;
  onDismiss: () => void;
  anchorEl: any;
  onLogoutButtonTapped: () => void;
}) {
  return (
    <Menu
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={props.isPresented}
      onClose={props.onDismiss}
    >
      <MenuItem onClick={props.onDismiss}>Profile</MenuItem>
      <MenuItem
        onClick={() => {
          props.onDismiss();
          props.onLogoutButtonTapped();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
}
