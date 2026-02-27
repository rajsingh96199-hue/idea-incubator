const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const db = require("../config/db");

router.post(
  "/create",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await db.query(
        "INSERT INTO ideas (student_id, title, description) VALUES (?, ?, ?)",
        [req.user.id, title, description]
      );

      res.status(201).json({ message: "Idea created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);





router.get(
  "/my",
  authMiddleware,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const student_id = req.user.id;

      const [rows] = await db.query(`
        SELECT 
          idea_id,
          title,
          description,
          status,
          mentor_feedback,
          created_at
        FROM ideas
        WHERE student_id = ?
        ORDER BY created_at DESC
      `, [student_id]);

      res.json({ ideas: rows });
    } catch (err) {
      console.error("STUDENT IDEAS ERROR:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
