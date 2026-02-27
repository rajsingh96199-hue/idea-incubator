import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f172a, #020617)",
      color: "white",
      textAlign: "center",
      padding: "40px"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
        Where Student Ideas Become Future Startups 🚀
      </h1>

      <p style={{ maxWidth: "700px", fontSize: "1.2rem", marginBottom: "30px", opacity: 0.9 }}>
        Idea Incubator connects students, mentors, and investors on a single platform.
        Students post ideas, mentors refine them, and investors fund the next big startup.
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/login">
          <button style={btnPrimary}>Login</button>
        </Link>
        <Link to="/register">
          <button style={btnOutline}>Register</button>
        </Link>
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: "12px 28px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#22c55e",
  color: "#020617"
};

const btnOutline = {
  padding: "12px 28px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid white",
  cursor: "pointer",
  background: "transparent",
  color: "white"
};
