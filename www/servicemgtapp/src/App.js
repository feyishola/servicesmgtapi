import "./App.css";
import { LandingPage } from "./pages/landingpage";
import ServiceRendering from "./pages/servicerenderingpage";
import { Link, BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* <ServiceRendering /> */}
      <LandingPage />
    </BrowserRouter>
  );
}

export default App;
