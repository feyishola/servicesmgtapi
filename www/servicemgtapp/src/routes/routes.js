import { Route } from "react-router-dom";
import ServiceRendering from "../pages/apps/servicerenderingpage";
import { LandingPage } from "../pages/landingpage/landingpage";
import LoginPage from "../pages/login";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";
// import { CgMenuRight, CgMenuLeft } from "react-icons/cg";
import SettingsIcon from "@mui/icons-material/Settings";
import DownloadIcon from "@mui/icons-material/Download";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WalletIcon from "@mui/icons-material/Wallet";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpIcon from "@mui/icons-material/Help";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ChatIcon from "@mui/icons-material/Chat";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

export const privateRoutes = [
  {
    name: "Service Renders",
    path: "/serviceapp",
    element: <ServiceRendering />,
  },
  {
    name: "DashBoard",
    path: "/dashboard",
    element: <ServiceRendering />,
  },
];

export const publicRoutes = [
  {
    name: "Login",
    path: "/login",
    element: <LoginPage />,
  },

  {
    name: "Home",
    path: "/",
    element: <LandingPage />,
  },
];

export const getRoutes = (allRoutes) => {
  allRoutes.map((route, index) => (
    <Route path={route.path} element={route.element} key={index + 1} />
  ));
};

export const serviceRendersRoutesDashboard = [
  {
    name: "Analytics",
    icon: <AnalyticsIcon />,
    to: "/dashboard",
  },

  {
    name: "Payment",
    icon: <WalletIcon />,
    to: "/payment",
  },
  {
    name: "Chat",
    icon: <ChatIcon />,
    to: "/chat",
  },

  {
    name: "Manage Services",
    icon: <SupportAgentIcon />,
    to: "/manageservices",
  },
  {
    name: "Profile",
    icon: <PermIdentityIcon />,
    to: "/profile",
  },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    to: "/setting",
  },
];
