import { useEffect, useState } from "react";
import api from "../services/api";

export default function MentorInterests() {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    api.get("/mentor/interests")
      .then(res => setInterests(res.data.interests))
      .catch(() => alert("Failed to load mentor interests"));
  }, []);

  return (
    <div>
      <h2>📩 Investor Interests</h2>
      {interests.length === 0 ? <p>No interests yet</p> :
        interests.map(int => (
          <div key={int.interest_id} className="card">
            <h3>{int.title}</h3>
            <p>👤 {int.investor_name} — {int.investor_email}</p>
            <p>Status: {int.status}</p>
          </div>
        ))
      }
    </div>
  );
}
