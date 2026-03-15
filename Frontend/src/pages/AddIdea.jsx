import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitIdea = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      toast.error("All fields are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/ideas/create",
        { title, description, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Idea submitted successfully 🚀");
      navigate("/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Submit Your Idea 💡
        </h2>

        <form onSubmit={submitIdea} className="space-y-4">

          {/* TITLE */}
          <input
            type="text"
            placeholder="Idea Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Describe your idea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {/* CATEGORY DROPDOWN */}
          <select
  value={category}
  onChange={(e) => {
    const selected = e.target.value;
    console.log("Selected category:", selected);
    setCategory(selected);
  }}
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

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold
              ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}
            `}
          >
            {loading ? "Submitting..." : "Submit Idea"}
          </button>

        </form>
      </div>
    </div>
  );
}