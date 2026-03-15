import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: ""
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "member";

  const updateProfile = async () => {
    try {
      await api.put("/auth/update-profile", {
        name: form.name,
        email: form.email
      });
      toast.success("Profile updated successfully 🚀");
    } catch {
      toast.error("Update failed");
    }
  };

  const changePassword = async () => {
    try {
      await api.put("/auth/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      toast.success("Password changed successfully 🔐");
    } catch {
      toast.error("Password change failed");
    }
  };

  const getAvatar = () => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const getRoleBadge = () => {
    const r = role?.toLowerCase();
    if (r === "investor") return { label: "Investor", style: "bg-amber-100 text-amber-700" };
    if (r === "mentor") return { label: "Mentor", style: "bg-purple-100 text-purple-700" };
    return { label: "Student", style: "bg-blue-100 text-blue-700" };
  };

  const badge = getRoleBadge();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
      </div>

      {/* AVATAR CARD */}
      <div className="bg-white rounded-2xl border p-6 flex items-center gap-5 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {getAvatar()}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-lg">{name}</p>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.style}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* UPDATE INFO CARD */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Update Information</h3>
          <p className="text-xs text-gray-400 mt-0.5">Change your name or email address</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={updateProfile}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          Save Changes
        </button>
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Change Password</h3>
          <p className="text-xs text-gray-400 mt-0.5">Keep your account secure</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Current Password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter current password"
                value={form.oldPassword}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition pr-10"
                onChange={e => setForm({ ...form, oldPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              >
                {showOld ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={form.newPassword}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition pr-10"
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              >
                {showNew ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={changePassword}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          Update Password
        </button>
      </div>

    </div>
  );
}