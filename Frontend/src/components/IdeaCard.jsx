import { Link } from "react-router-dom";

export default function IdeaCard({ idea }) {
  if (!idea) return null;

  return (
    <div style={{
      border:"1px solid #ccc", 
      padding:"10px", 
      margin:"10px 0",
      borderRadius:"6px"
    }}>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <p><b>Status:</b> {idea.status}</p>
      
      <Link to={`/ideas/${idea.idea_id}`}>
        <button>View Idea</button>
      </Link>
    </div>
  );
}
