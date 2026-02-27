import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{background:"#222", padding:"10px"}}>
      <Link to="/" style={{color:"#fff", marginRight:"15px"}}>Home</Link>

      {!token && (
        <>
          <Link to="/login" style={{color:"#fff", marginRight:"15px"}}>Login</Link>
          <Link to="/register" style={{color:"#fff"}}>Register</Link>
        </>
      )}

      {token && (
        <>
          <Link to="/dashboard" style={{color:"#fff", marginRight:"15px"}}>Dashboard</Link>
          <Link to="/mentor" style={{color:"#fff", marginRight:"15px"}}>Mentor</Link>
          <Link to="/investor" style={{color:"#fff", marginRight:"15px"}}>Investor</Link>
          <button onClick={logout} style={{marginLeft:"20px"}}>Logout</button>
        </>
      )}
    </nav>
  );
}
