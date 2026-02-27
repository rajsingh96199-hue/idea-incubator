import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [count, setCount] = useState(0);

  // 🔔 Notifications ONLY for student
  useEffect(() => {
    if (role !== "student") return;

    api.get("/notifications")
      .then(res => {
        const unread = res.data.notifications
          ?.filter(n => !n.is_read).length || 0;
        setCount(unread);
      })
      .catch(() => {});
  }, [role]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass =
    "block px-4 py-2 rounded text-white hover:bg-gray-700 transition";

  return (
    <div className="h-screen w-64 bg-slate-900 text-white fixed flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Idea Incubator 🚀
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {role === "student" && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              🎓 Dashboard
            </NavLink>

            <NavLink to="/ideas/add" className={linkClass}>
              ➕ Add Idea
            </NavLink>

            <NavLink
              to="/notifications"
              className={`${linkClass} flex justify-between items-center`}
            >
              <span>🔔 Notifications</span>
              {count > 0 && (
                <span className="bg-red-500 text-white px-2 rounded-full text-xs">
                  {count}
                </span>
              )}
            </NavLink>
          </>
        )}

        {role === "mentor" && (
          <>
            <NavLink to="/mentor" className={linkClass}>
              🧑‍🏫 Mentor Dashboard
            </NavLink>

            <NavLink to="/mentor/history" className={linkClass}>
              📜 Review History
            </NavLink>
          </>
        )}

        {role === "investor" && (
          <NavLink to="/investor" className={linkClass}>
            💰 Investor Dashboard
          </NavLink>
        )}
      </nav>

      {/* ❌ NO CHAT LINK HERE — CHAT IS CONTEXTUAL */}

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
