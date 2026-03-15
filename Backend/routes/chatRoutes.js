const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authMiddleware } = require("../middleware/authMiddleware");


// SEND MESSAGE
router.post("/send", authMiddleware, async (req, res) => {
const { receiver_id, message } = req.body;

if (!receiver_id || !message) {
return res.status(400).json({ error: "Missing receiver or message" });
}

try {

// insert message
const [result] = await db.query(
  `INSERT INTO messages (sender_id, receiver_id, message)
   VALUES (?, ?, ?)`,
  [req.user.id, receiver_id, message]
);

// fetch the exact row we just inserted
const [rows] = await db.query(
  `SELECT *
   FROM messages
   WHERE message_id = ?`,
  [result.insertId]
);

res.json(rows[0]);

} catch (err) {
console.error("MYSQL ERROR:", err);
res.status(500).json({ error: err.message });
}
});


// GET CONVERSATION LIST
router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        MAX(m.created_at) AS last_time,
        (
          SELECT message 
          FROM messages 
          WHERE 
            (sender_id = u.user_id AND receiver_id = ?)
            OR
            (sender_id = ? AND receiver_id = u.user_id)
          ORDER BY created_at DESC 
          LIMIT 1
        ) AS last_message,
        (
          SELECT COUNT(*) 
          FROM messages 
          WHERE sender_id = u.user_id 
          AND receiver_id = ? 
          AND status != 'seen'
        ) AS unread_count
      FROM messages m
      JOIN users u 
        ON u.user_id = 
          CASE 
            WHEN m.sender_id = ? THEN m.receiver_id
            ELSE m.sender_id
          END
      WHERE m.sender_id = ? OR m.receiver_id = ?
      GROUP BY u.user_id, u.name
      ORDER BY last_time DESC
    `, [userId, userId, userId, userId, userId, userId]);

    res.json({ conversations: rows });

  } catch (err) {
    console.error("Conversation error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔥 ADD THIS BACK — THIS WAS MISSING
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;

    const [messages] = await db.query(`
      SELECT *
      FROM messages
      WHERE 
        (sender_id = ? AND receiver_id = ?)
        OR
        (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `, [myId, otherUserId, otherUserId, myId]);

    const [[receiver]] = await db.query(
      "SELECT name FROM users WHERE user_id = ?",
      [otherUserId]
    );

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