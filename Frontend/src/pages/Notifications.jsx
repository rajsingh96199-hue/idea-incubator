import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Load notifications
  useEffect(() => {
    api.get("/notifications")
      .then(res => {
        setNotifications(res.data.notifications || []);
      })
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  // 🧹 Clear all notifications
  const clearAll = async () => {
    try {
      await api.post("/notifications/clear");
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  // 🎨 UI helpers
  const getStyle = (type) => {
    switch (type) {
      case "approved":
        return "border-green-200 bg-green-50 text-green-700";
      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-blue-200 bg-blue-50 text-blue-700";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🔔 Notifications
        </h2>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {/* CONTENT */}
      {loading && (
        <p className="text-center text-gray-500">Loading notifications...</p>
      )}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-lg font-medium">You’re all caught up</p>
          <p className="text-sm">No new notifications</p>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map(n => (
          <div
            key={n.notification_id}
            className={`border rounded-xl p-4 flex gap-4 items-start ${getStyle(n.type)}`}
          >
            <div className="text-2xl">
              {getIcon(n.type)}
            </div>

            <div className="flex-1">
              <p className="font-medium">{n.message}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
