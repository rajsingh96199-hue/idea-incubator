import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function InvestorDashboard() {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/investor/approved", {
      params: { search, category }
    })
      .then(res => setIdeas(res.data.ideas || []))
      .catch(() => toast.error("Failed to load approved ideas"));
  }, [search, category]);

  const openChat = (studentId) => {
    navigate(`/chat/${studentId}`);
  };

  const expressInterest = async (ideaId) => {
    try {
      await api.post(`/investor/interest/${ideaId}`);
      toast.success("Interest sent 🚀");

      setIdeas(prev =>
        prev.map(i =>
          i.idea_id === ideaId
            ? { ...i, interested: true }
            : i
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Already interested");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900">
            💰 Investor Dashboard
          </h2>
          <p className="text-gray-600 mt-2">
            Browse approved startup ideas and connect with founders.
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-full md:w-1/2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-lg w-full md:w-1/4"
          >
            <option value="All">All</option>
            <option value="AI">AI</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Fintech">Fintech</option>
            <option value="EdTech">EdTech</option>
            <option value="Agriculture">Agriculture</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* EMPTY STATE */}
        {ideas.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500">
            No approved ideas found.
          </div>
        ) : (

          /* IDEAS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea.idea_id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* TITLE */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {idea.title}
                  </h3>

                  {/* CATEGORY BADGE */}
                  <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-3">
                    {idea.category || "General"}
                  </span>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {idea.description}
                  </p>

                  {/* STUDENT INFO */}
                  <div className="border-t pt-3 text-sm text-gray-600">
                    <p className="font-semibold text-gray-800">
                      🎓 {idea.student_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {idea.student_email}
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 mt-5">

                  {/* EXPRESS INTEREST */}
                  <button
                    onClick={() => expressInterest(idea.idea_id)}
                    disabled={idea.interested}
                    className={`flex-1 py-2 rounded-xl font-semibold transition
                      ${idea.interested
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"}
                    `}
                  >
                    {idea.interested ? "Interested ✓" : "Express Interest"}
                  </button>

                  {/* CHAT BUTTON */}
                  <button
                    onClick={() => openChat(idea.student_id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
                  >
                    💬 Chat
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}