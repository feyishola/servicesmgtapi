import { Route } from "react-router-dom";
import ServiceRendering from "../pages/apps/servicerenderingpage";
import { LandingPage } from "../pages/landingpage/landingpage";
import LoginPage from "../pages/login";
import RegistrationPage from "../pages/register";

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
    name: "Register",
    path: "/register",
    element: <RegistrationPage />,
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
