import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function InvestorDashboard() {
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/investor/approved")
      .then(res => setIdeas(res.data.ideas || []))
      .catch(() => toast.error("Failed to load approved ideas"));
  }, []);

  const openChat = (studentId) => {
    navigate(`/chat/${studentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-br from-gray-50 to-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
            💰 Investor Dashboard
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Browse mentor-approved startup ideas and connect directly with student founders.
          </p>
        </div>

        {/* EMPTY STATE */}
        {ideas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed p-14 text-center text-gray-500">
            <p className="text-5xl mb-4">🚀</p>
            <p className="text-xl font-semibold mb-1">
              No approved ideas yet
            </p>
            <p className="text-sm">
              Come back later to explore new opportunities
            </p>
          </div>
        ) : (
          /* IDEAS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map(idea => (
              <div
                key={idea.idea_id}
                className="
                  bg-white rounded-2xl border
                  p-6 flex flex-col justify-between
                  transition-all duration-300
                  hover:shadow-2xl hover:-translate-y-1
                "
              >
                {/* IDEA CONTENT */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {idea.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-3">
                    {idea.description}
                  </p>

                  <div className="border-t pt-3 text-sm text-gray-600">
                    <p className="font-semibold text-gray-800">
                      🎓 {idea.student_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {idea.student_email}
                    </p>
                  </div>
                </div>

                {/* ACTION */}
                <button
                  onClick={() => openChat(idea.student_id)}
                  className="
                    mt-6 w-full
                    bg-blue-600 hover:bg-blue-700
                    text-white py-2.5 rounded-xl
                    font-semibold
                    transition-all duration-200
                    hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                >
                  💬 Chat with Founder
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
