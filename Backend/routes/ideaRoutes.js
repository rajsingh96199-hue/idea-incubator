const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

/**
 * CREATE IDEA (Student)
 */
router.post(
  "/create",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const { title, description, category } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await db.query(
        "INSERT INTO ideas (student_id, title, description, category) VALUES (?, ?, ?, ?)",
        [req.user.id, title, description, category || "General"]
      );

      res.status(201).json({ message: "Idea created successfully" });

    } catch (err) {
      console.error("CREATE IDEA ERROR:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * GET MY IDEAS (Student)
 */
router.get(
  "/my",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT idea_id, title, description, category, status, mentor_feedback, created_at
         FROM ideas
         WHERE student_id = ?
         ORDER BY created_at DESC`,
        [req.user.id]
      );

      res.json({ ideas: rows });

    } catch (err) {
      console.error("GET MY IDEAS ERROR:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;