import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Box, CircularProgress } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/Landing";

// The landing page ships in the main bundle; everything else (map, chat,
// dashboard) loads on demand so first paint stays fast.
const named = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));
const SearchPage = named(() => import("./pages/Search"), "SearchPage");
const JoinPage = named(() => import("./pages/Join"), "JoinPage");
const LoginPage = named(() => import("./pages/Login"), "LoginPage");
const NotFound = named(() => import("./pages/NotFound"), "NotFound");
const DashboardLayout = named(() => import("./pages/dashboard/DashboardLayout"), "DashboardLayout");
const Overview = named(() => import("./pages/dashboard/Overview"), "Overview");
const Inbox = named(() => import("./pages/dashboard/Inbox"), "Inbox");

const Loading = () => (
  <Box sx={{ height: "100dvh", display: "grid", placeItems: "center" }}>
    <CircularProgress size={28} />
  </Box>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="inbox" element={<Inbox />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
