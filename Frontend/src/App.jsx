import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddIdea from "./pages/AddIdea";
import MentorDashboard from "./pages/MentorDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import Notifications from "./pages/Notifications";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { registerLoader } from "./services/api";
import MentorHistory from "./pages/MentorHistory";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import socket from "./services/socket";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    registerLoader(setLoading);
  }, []);

  // 🔥 Proper socket handling
  useEffect(() => {
  const myId = localStorage.getItem("userId");
  if (!myId) return;

  socket.emit("join", myId);
}, []);
 // reconnect on route change

  return (
    <>
      <Toaster position="top-right" />
      {loading && <Loader />}

      <Routes>
        {/* Landing */}
        <Route path="/" element={<Home />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ideas/add"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddIdea />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Mentor */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MentorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MentorHistory />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Investor */}
        <Route
          path="/investor"
          element={
            <ProtectedRoute>
              <MainLayout>
                <InvestorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Chat */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ChatPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </>
  );
}