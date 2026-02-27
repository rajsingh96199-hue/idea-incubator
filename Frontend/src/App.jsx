import { Routes, Route, Navigate } from "react-router-dom";
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
import Chat from "./pages/Chat";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    registerLoader(setLoading);
  }, []);

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

        {/* Mentor History */}
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

        <Route
          path="/chat/:userId"
          element={
           <ProtectedRoute>
            <MainLayout>
              <Chat />
            </MainLayout>
           </ProtectedRoute>
          }
        />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
