const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const db = require("../config/db");

// 🔔 GET notifications for logged-in student
router.get(
  "/",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const [rows] = await db.query(
        `
        SELECT notification_id, message, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
      );

      res.json({ notifications: rows });
    } catch (err) {
      console.error("❌ Notification fetch error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


// MARK notification as read
router.put(
  "/read/:id",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const notifId = req.params.id;

      await db.query(
        "UPDATE notifications SET is_read = 1 WHERE notification_id = ?",
        [notifId]
      );

      res.json({ success: true });
    } catch (err) {
      console.error("Mark read error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ CLEAR ALL NOTIFICATIONS (STUDENT ONLY)
router.post(
  "/clear",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      await db.query(
        "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
        [req.user.id]
      );

      res.json({ success: true });
    } catch (err) {
      console.error("Clear notifications error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


module.exports = router;
