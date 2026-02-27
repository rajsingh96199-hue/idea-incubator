import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function MentorHistory() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    api.get("/mentor/history")
      .then(res => setIdeas(res.data.ideas || []))
      .catch(() => toast.error("Failed to load history"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Mentor Review History 📜</h2>

      {ideas.length === 0 && <p>No reviewed ideas yet</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map(idea => (
          <div
            key={idea.idea_id}
            className="bg-white border rounded-xl p-5 shadow"
          >
            <h3 className="font-semibold">{idea.title}</h3>
            <p className="text-gray-600">{idea.description}</p>

            <p className="mt-2 text-sm">
              👤 Student: {idea.student_name}
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                idea.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {idea.status.toUpperCase()}
            </span>

            {idea.mentor_feedback && (
              <div className="mt-3 bg-blue-50 p-3 rounded border">
                <strong>Feedback:</strong>
                <p>{idea.mentor_feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}