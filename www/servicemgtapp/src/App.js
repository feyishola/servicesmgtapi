import "./App.css";
import { LandingPage } from "./pages/landingpage/landingpage";
import ServiceRendering from "./pages/apps/servicerenderingpage";
import { Link, BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/serviceapp" element={<ServiceRendering />} />

        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
