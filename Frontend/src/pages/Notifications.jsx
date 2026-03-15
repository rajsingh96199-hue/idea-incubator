import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then(res => {
        setNotifications(res.data.notifications || []);
      })
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  const clearAll = async () => {
    try {
      await api.post("/notifications/clear");
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  const getConfig = (type) => {
    switch (type) {
      case "approved":
        return {
          icon: "✅",
          bg: "bg-green-50",
          border: "border-l-green-500",
          badge: "bg-green-100 text-green-700",
          label: "Approved"
        };
      case "rejected":
        return {
          icon: "❌",
          bg: "bg-red-50",
          border: "border-l-red-500",
          badge: "bg-red-100 text-red-700",
          label: "Rejected"
        };
      default:
        return {
          icon: "💬",
          bg: "bg-blue-50",
          border: "border-l-blue-500",
          badge: "bg-blue-100 text-blue-700",
          label: "Info"
        };
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🔔 Notifications
          </h2>
          {notifications.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {notifications.length} notification{notifications.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-4 py-1.5 rounded-full transition-all duration-200"
          >
            Clear all
          </button>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && notifications.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-3">🎉</div>
          <p className="text-lg font-semibold text-gray-600">You're all caught up!</p>
          <p className="text-sm mt-1">No new notifications right now.</p>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {notifications.map(n => {
          const config = getConfig(n.type);
          return (
            <div
              key={n.notification_id}
              className={`flex items-start gap-4 p-4 rounded-2xl border-l-4 shadow-sm ${config.bg} ${config.border} bg-white`}
            >
              {/* Icon */}
              <div className="text-2xl mt-0.5 shrink-0">
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {n.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
                    {config.label}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {formatTime(n.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}