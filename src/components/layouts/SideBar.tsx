import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Drawer as MuiDrawer,
  Typography,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { drawerItems } from "../../config/drawerItems";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { toggleNavBar } from "../../store/uiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import logo2 from "../../assets/dj-logo.png";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const backgroundColor =
    theme.palette.mode === "dark" ? theme.palette.background.default : "#fff";

  return {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": {
      backgroundColor,
      color: theme.palette.text.primary,
      boxShadow: "none",
      ...(open ? openedMixin(theme) : closedMixin(theme)),
    },
    ...(open ? openedMixin(theme) : closedMixin(theme)),
  };
});

const Sidebar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.navBarOpen);
  const location = useLocation();
  const navigate = useNavigate();

  const handleToggle = () => {
    dispatch(toggleNavBar());
  };

  const renderItem = (label: string, icon: React.ReactNode, path: string) => {
    const isActive = location.pathname.startsWith(path);

    return (
      <ListItem key={label} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={() => navigate(path)}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            borderRadius: 2,
            backgroundColor: isActive
              ? theme.palette.action.selected
              : "transparent",
            boxShadow: isActive ? "0px 4px 12px rgba(0,0,0,0.1)" : "none",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.text.primary,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : "auto",
              justifyContent: "center",
            }}
          >
            <Tooltip title={!open ? label : ""} placement="right">
              <Box
                sx={{
                  backgroundColor: isActive
                    ? theme.palette.primary.main
                    : theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],
                  borderRadius: "50%",
                  padding: 1,
                  boxShadow: isActive ? "0 0 6px rgba(0,0,0,0.2)" : "none",
                  color: isActive
                    ? theme.palette.common.white
                    : theme.palette.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </Box>
            </Tooltip>
          </ListItemIcon>

          <ListItemText
            primary={label}
            sx={{
              opacity: open ? 1 : 0,
              fontWeight: isActive ? 600 : 400,
              transition: "color 0.3s ease",
              ".MuiListItemButton:hover &": {
                color: theme.palette.text.primary,
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader sx={{ justifyContent: open ? "space-evenly" : "center" }}>
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={logo2}
              alt="Logo"
              style={{
                width: "50px",
                height: "auto",
                objectFit: "contain",
              }}
            />
            <Typography variant="caption">
              Dj admin
              {/* <br />
              <span style={{ marginLeft: "5px" }}>Yucatán</span> */}
            </Typography>
          </Box>
        )}
        <IconButton onClick={handleToggle}>
          {!open ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {drawerItems.map(({ label, icon, path }) =>
          renderItem(label, icon, path)
        )}
      </List>
      <Divider />
      <List>
        {/* {renderItem("Usuarios", <GroupIcon />, "/users")} */}
        {renderItem("Cerrar sesión", <LogoutIcon />, "/login")}
      </List>
    </Drawer>
  );
};

export default Sidebar;
