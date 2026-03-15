const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const http = require("http");
const { Server } = require("socket.io");

const db = require("./config/db");

// -------------------- MIDDLEWARE --------------------
app.use(express.json({ limit: "1mb" }));

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// -------------------- DB CONNECTION --------------------
db.getConnection()
  .then(() => console.log("✔️ Database connected"))
  .catch(err => console.error("❌ DB Connection Failed", err));

// -------------------- HEALTH CHECK --------------------
app.get("/", (req, res) => {
  res.send("🩺 API Online & Healthy");
});

// -------------------- ROUTES --------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ideas", require("./routes/ideaRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/investor", require("./routes/investorRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

console.log("Routes Loaded");

// -------------------- 404 HANDLER --------------------
app.use((req, res) => res.status(404).json({ error: "Route Not Found" }));

process.on("unhandledRejection", err => {
  console.error("🔥 Unhandled Rejection:", err);
});

// -------------------- SOCKET SERVER --------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // 🔹 Join personal room
  socket.on("join", (userId) => {
    socket.join(String(userId));
    socket.userId = userId; // store for disconnect
    io.emit("userOnline", { userId });
    console.log(`User ${userId} joined room`);
  });

  // 🔹 Send message (ONLY emit, no DB update here)
  socket.on("sendMessage", ({ message }) => {
    if (!message?.receiver_id) return;

    // Emit to receiver only
    io.to(String(message.receiver_id)).emit("receiveMessage", message);

    console.log("📤 Message emitted to receiver:", message);
  });

  // 🔹 Confirm delivery
  socket.on("messageDelivered", async ({ messageId, senderId }) => {
    try {
      if (!messageId) return;

      await db.query(
        `UPDATE messages 
         SET status = 'delivered'
         WHERE id = ?`,
        [messageId]
      );

      // Notify sender that message was delivered
      io.to(String(senderId)).emit("messageDelivered", { messageId });

      console.log("✔ Message delivered updated:", messageId);

    } catch (err) {
      console.error("Delivery update error:", err);
    }
  });

  // 🔹 Mark messages as seen
  socket.on("markSeen", async ({ senderId, receiverId }) => {
    try {
      await db.query(
        `UPDATE messages 
         SET status = 'seen'
         WHERE sender_id = ? 
         AND receiver_id = ?
         AND status != 'seen'`,
        [senderId, receiverId]
      );

      io.to(String(receiverId)).emit("messageSeen", {
        sender_id: senderId,
        receiver_id: receiverId
      });

      console.log("👀 Seen emitted to:", String(receiverId));

    } catch (err) {
      console.error("Seen update error:", err);
    }
  });



  // 🔹 Check if user is online
socket.on("checkOnline", ({ userId }) => {
  const rooms = io.sockets.adapter.rooms;
  console.log("🔍 All rooms:", [...rooms.keys()]);
  const isOnline = rooms.has(String(userId));
  socket.emit("userOnlineStatus", { userId, isOnline });
  console.log(`🔍 checkOnline: user ${userId} is ${isOnline ? "online" : "offline"}`);
});

  // 🔹 Typing indicator
  socket.on("typing", ({ senderId, receiverId }) => {
    io.to(String(receiverId)).emit("typing", { senderId });
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    io.to(String(receiverId)).emit("stopTyping", { senderId });
  });

  // 🔹 Disconnect → broadcast offline
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.userId);
    if (socket.userId) {
      io.emit("userOffline", { userId: socket.userId });
    }
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));