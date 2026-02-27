const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const chatRoutes = require("./routes/chatRoutes");
// --- Security + Parsing ---
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- DB CONNECTION --- 
const db = require("./config/db");
db.getConnection()
  .then(() => console.log("✔️ Database connected"))
  .catch(err => console.error("❌ DB Connection Failed", err));

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
  res.send("🩺 API Online & Healthy");
});


// --- ROUTES ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ideas", require("./routes/ideaRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/investor", require("./routes/investorRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/chat", chatRoutes);


console.log("Routes Loaded:", {
  auth: "/api/auth",
  ideas: "/api/ideas",
  mentor: "/api/mentor",
  investor: "/api/investor",
  notifications: "/api/notifications",
  student: "/api/student"
});

// --- 404 HANDLER ---
app.use((req, res) => res.status(404).json({ error: "Route Not Found" }));

// --- PROCESS ERROR CATCH ---
process.on("unhandledRejection", err => {
  console.error("🔥 Unhandled Rejection:", err);
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
