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

  // ✅ FILTER (case-safe)
  const filteredIdeas = ideas.filter(i => {
    if (filter === "ALL") return true;
    return i.status?.toUpperCase() === filter;
  });

  // 🎨 STATUS BADGE STYLE
  const statusStyle = (status) => {
    const s = status?.toUpperCase();
    if (s === "APPROVED") return "bg-green-100 text-green-700";
    if (s === "REJECTED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 space-y-10">

      {/* HEADER */}
      <h2 className="text-3xl font-bold flex items-center gap-2">
        🎓 Student Dashboard
      </h2>

      {/* FILTER TABS */}
      <div className="flex gap-3">
        {["ALL", "APPROVED", "REJECTED"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1 rounded-full text-sm font-medium border
              transition transform duration-200
              ${filter === s
                ? "bg-blue-500 text-white scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100 hover:scale-105"}
            `}
          >
            {s}
          </button>
        ))}
      </div>

      {/* IDEAS */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Ideas</h3>

        {filteredIdeas.length === 0 && (
          <p className="text-gray-500">No ideas found</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIdeas.map(idea => {
            const isOpen = expanded === idea.idea_id;

            return (
              <div
                key={idea.idea_id}
                onClick={() => setExpanded(isOpen ? null : idea.idea_id)}
                className="
                  bg-white p-5 rounded-xl border
                  cursor-pointer
                  transition-all duration-300 ease-in-out
                  hover:-translate-y-1 hover:shadow-lg
                "
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-lg">
                    {idea.title}
                  </h4>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyle(idea.status)}`}
                  >
                    {idea.status.toUpperCase()}
                  </span>
                </div>

                {/* DESCRIPTION (ANIMATED) */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-6 opacity-80 mt-2"}
                  `}
                >
                  <p className="text-gray-600">
                    {isOpen
                      ? idea.description
                      : idea.description.slice(0, 60) + "..."}
                  </p>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  {isOpen ? "Click to collapse" : "Click to expand"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* INVESTOR INTERESTS */}
      <div>
        <h3 className="text-xl font-semibold mb-4">💰 Investor Interest</h3>

        {interests.length === 0 && (
          <p className="text-gray-500">No investors yet</p>
        )}

        <div className="space-y-4">
          {interests.map(i => (
            <div
              key={`${i.idea_id}-${i.investor_id}`}
              className="
                bg-white border p-4 rounded-xl
                flex justify-between items-center
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-0.5
              "
            >
              <div>
                <p className="font-semibold">{i.title}</p>
                <p className="text-sm text-gray-600">
                  Investor: {i.investor_name}
                </p>
              </div>

              <button
                onClick={() => openChat(i.investor_id)}
                className="
                  bg-blue-500 hover:bg-blue-600
                  text-white px-4 py-2 rounded
                  transition-transform duration-200
                  hover:scale-105
                "
              >
                Chat 💬
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
