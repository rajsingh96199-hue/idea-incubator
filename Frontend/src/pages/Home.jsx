import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white">
      <div className="text-center max-w-3xl px-6">

        {/* APP NAME */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-wide">
          Inno<span className="text-green-400">Bridge</span>
        </h1>

        {/* TAGLINE */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200">
          Where Student Ideas Become Future Startups 
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          InnoBridge is a web-based idea incubation platform that connects
          students with mentors and investors, helping innovative ideas grow
          into successful startups.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-5">
          <button
            onClick={() => navigate("/login")}
            className="
              bg-green-500 hover:bg-green-600
              px-8 py-3 rounded-xl
              font-semibold
              transition-all duration-200
              hover:scale-105
            "
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="
              border border-gray-400
              px-8 py-3 rounded-xl
              font-semibold
              hover:bg-gray-800
              transition-all duration-200
            "
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}
