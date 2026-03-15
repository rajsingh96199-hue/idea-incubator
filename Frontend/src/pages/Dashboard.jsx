import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [interests, setInterests] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/ideas/my")
      .then(res => setIdeas(res.data.ideas || []))
      .catch(() => toast.error("Failed to load ideas"));

    api.get("/student/interests")
      .then(res => setInterests(res.data.interests || []))
      .catch(() => toast.error("Failed to load investor interests"));
  }, []);

  const openChat = (investorId) => {
    navigate(`/chat/${investorId}`);
  };

  const filteredIdeas = ideas.filter(i => {
    if (filter === "ALL") return true;
    return i.status?.toUpperCase() === filter;
  });

  const statusConfig = (status) => {
    const s = status?.toUpperCase();
    if (s === "APPROVED") return { style: "bg-green-100 text-green-700", dot: "bg-green-500" };
    if (s === "REJECTED") return { style: "bg-red-100 text-red-700", dot: "bg-red-500" };
    return { style: "bg-amber-100 text-amber-700", dot: "bg-amber-400" };
  };

  const totalApproved = ideas.filter(i => i.status?.toUpperCase() === "APPROVED").length;
  const totalRejected = ideas.filter(i => i.status?.toUpperCase() === "REJECTED").length;
  const totalPending = ideas.filter(i => i.status?.toUpperCase() === "PENDING").length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">🎓 Student Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Track your ideas and investor interest</p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-blue-500">{ideas.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Ideas</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-green-500">{totalApproved}</p>
          <p className="text-xs text-gray-500 mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
          <p className="text-3xl font-bold text-amber-500">{totalPending}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
      </div>

      {/* IDEAS SECTION */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Ideas</h3>

          {/* FILTER TABS */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
            {["ALL", "APPROVED", "REJECTED"].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1 rounded-full text-xs font-semibold transition-all duration-200
                  ${filter === s
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"}
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filteredIdeas.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">💡</p>
            <p className="text-sm font-medium">No ideas found</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIdeas.map(idea => {
            const isOpen = expanded === idea.idea_id;
            const config = statusConfig(idea.status);

            return (
              <div
                key={idea.idea_id}
                onClick={() => setExpanded(isOpen ? null : idea.idea_id)}
                className="bg-white p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-semibold text-gray-800 text-sm leading-snug">
                    {idea.title}
                  </h4>
                  <span className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${config.style}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {idea.status.toUpperCase()}
                  </span>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 mt-3" : "max-h-8 mt-2"}`}>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isOpen ? idea.description : idea.description.slice(0, 70) + "..."}
                  </p>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  {isOpen ? "▲ Collapse" : "▼ Expand"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* INVESTOR INTERESTS */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Investor Interest</h3>

        {interests.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm font-medium">No investors yet</p>
          </div>
        )}

        <div className="space-y-3">
          {interests.map(i => (
            <div
              key={`${i.idea_id}-${i.investor_id}`}
              className="bg-white border p-4 rounded-2xl flex justify-between items-center hover:shadow-md transition-all duration-200"
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{i.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  👤 {i.investor_name}
                </p>
              </div>

              <button
                onClick={() => openChat(i.investor_id)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1"
              >
                💬 Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}