// import HomeIcon from "@mui/icons-material/Home";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
// import HailIcon from "@mui/icons-material/Hail";
// import AdUnitsIcon from "@mui/icons-material/AdUnits";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import InventoryIcon from "@mui/icons-material/Inventory";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import BusinessIcon from "@mui/icons-material/Business";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import EventIcon from "@mui/icons-material/Event";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const drawerItems = [
  {
    label: "Eventos",
    path: "/events",
    icon: <EventIcon />,
  },
  {
    label: "Grupos",
    path: "/groups",
    icon: <AutoAwesomeMotionIcon />,
  },
  {
    label: "Compañía",
    path: "/company",
    icon: <BusinessIcon />,
  },
  {
    label: "Suscripciones",
    path: "/subscriptions",
    icon: <SubscriptionsIcon />,
  },
  {
    label: "Cuenta",
    path: "/me",
    icon: <ManageAccountsIcon />,
  },
];
