import { useParams } from "react-router-dom";

export default function ViewIdea() {
  const { id } = useParams();

  return (
    <div>
      <h2>View Idea</h2>
      <p>Idea ID: {id}</p>
      <p>Later: fetch idea details from backend.</p>
    </div>
  );
}
