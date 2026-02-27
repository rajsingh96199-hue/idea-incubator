const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authMiddleware } = require("../middleware/authMiddleware");

// SEND MESSAGE
router.post("/send", authMiddleware, async (req, res) => {
  const { receiver_id, message } = req.body;

  console.log("📩 SEND BODY:", req.body);
  console.log("👤 SENDER:", req.user);

  if (!receiver_id || !message) {
    return res.status(400).json({ error: "Missing receiver or message" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, message)
       VALUES (?, ?, ?)`,
      [req.user.id, receiver_id, message]
    );

    console.log("✅ INSERT RESULT:", result);

    res.json({ success: true });
  } catch (err) {
    console.error("🔥 MYSQL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET CHAT BETWEEN TWO USERS
router.get("/:userId", authMiddleware, async (req, res) => {
  const otherUserId = req.params.userId;

  try {
    // 1️⃣ Fetch messages
    const [messages] = await db.query(
      `
      SELECT *
      FROM messages
      WHERE 
        (sender_id = ? AND receiver_id = ?)
        OR
        (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
      `,
      [req.user.id, otherUserId, otherUserId, req.user.id]
    );

    // 2️⃣ Fetch other user's name
    const [[receiver]] = await db.query(
      "SELECT name FROM users WHERE user_id = ?",
      [otherUserId]
    );

    // 3️⃣ Send combined response
    res.json({
      messages,
      otherUser: {
        name: receiver?.name || "User"
      }
    });

  } catch (err) {
    console.error("Get chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
