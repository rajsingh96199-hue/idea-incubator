import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/auth/register", form);

    alert("User registered successfully");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={e => setForm({...form, name: e.target.value})}
        /><br/><br/>

        <input
          placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})}
        /><br/><br/>

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})}
        /><br/><br/>

        <select
          onChange={e => setForm({...form, role: e.target.value})}
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="investor">Investor</option>
        </select><br/><br/>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
