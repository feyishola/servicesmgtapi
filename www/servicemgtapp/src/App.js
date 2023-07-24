import "./App.css";
import { LandingPage } from "./pages/landingpage/landingpage";
import ServiceRendering from "./pages/apps/servicerenderingpage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import SrRegistrationPage from "./pages/servicerenderspages/servicerendersregister";
import Protected from "./routes/protectedroute";
import ConsumerRegistrationPage from "./pages/consumerpages/consumersregister";
import { LinksToRegPage } from "./pages/reglinks";
import { Layout } from "./pages/layout";
import { PageNotFound } from "./pages/404page";
import MyDrawer from "./components/drawer";
import { serviceRendersRoutesDashboard } from "./routes/routes";
import { SRDashboard } from "./pages/servicerenderspages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <Layout name={"Login Page"}>
              <LoginPage />
            </Layout>
          }
        />

        <Route
          path="/serviceapp"
          element={
            <Protected>
              <ServiceRendering />
            </Protected>
          }
        />

        <Route
          path="/renderreg"
          element={
            <Layout name={"Registration Page"}>
              <SrRegistrationPage />
            </Layout>
          }
        />
        <Route
          path="/consumerreg"
          element={
            <Layout name={"Registration Page"}>
              <ConsumerRegistrationPage />
            </Layout>
          }
        />
        <Route
          path="/regpage"
          element={
            <Layout name={"Choose Registration Form"} info={""}>
              <LinksToRegPage />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MyDrawer
              navRoutes={serviceRendersRoutesDashboard}
              children={<SRDashboard />}
            />
          }
        />
        <Route
          path="*"
          element={
            <Layout
              name={"Page Not Found"}
              info={"Page has either been moved or does not exist."}
            >
              <PageNotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
