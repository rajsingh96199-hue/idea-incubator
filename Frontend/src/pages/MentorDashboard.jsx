import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function MentorDashboard() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    api.get("/mentor/ideas")
      .then(res => setIdeas(res.data.ideas || []))
      .catch(() => toast.error("Failed to load ideas"));
  }, []);

  const review = (id, status) => {
    api.put(`/mentor/review/${id}`, { status })
      .then(() => {
        toast.success(`Idea ${status} 🎯`);
        setIdeas(prev => prev.filter(i => i.idea_id !== id));
      })
      .catch(() => toast.error("Action failed"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Mentor Panel 🎓</h2>

      {ideas.length === 0 && <p>No pending ideas</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map(idea => (
          <div
            key={idea.idea_id}
            className="bg-white border border-gray-300 rounded-xl shadow-sm p-5"
          >
            <h3 className="text-lg font-semibold">{idea.title}</h3>
            <p className="text-gray-600 mb-4">{idea.description}</p>

            <div className="flex gap-3">
              <button
                onClick={() => review(idea.idea_id, "approved")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve ✅
              </button>

              <button
                onClick={() => review(idea.idea_id, "rejected")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
