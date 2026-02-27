const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

/**
 * 🎓 GET STUDENT PROFILE
 */
router.get(
  "/me",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const [[student]] = await db.query(
        "SELECT user_id, name, email, role FROM users WHERE user_id = ?",
        [req.user.id]
      );

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.json({ student });
    } catch (err) {
      console.error("Student profile error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * 💰 GET INVESTOR INTERESTS FOR STUDENT
 */
router.get(
  "/interests",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const studentId = req.user.id;

      const [rows] = await db.query(`
        SELECT 
          i.idea_id,
          ideas.title,
          u.user_id AS investor_id,
          u.name AS investor_name,
          u.email AS investor_email,
          i.created_at
        FROM interest i
        JOIN ideas ON i.idea_id = ideas.idea_id
        JOIN users u ON i.investor_id = u.user_id
        WHERE ideas.student_id = ?
        ORDER BY i.created_at DESC
      `, [studentId]);

      res.json({ interests: rows });
    } catch (err) {
      console.error("Student interests error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
