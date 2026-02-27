const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

/**
 * GET approved ideas (Investor Dashboard)
 */
router.get(
  "/approved",
  authMiddleware,
  requireRole(["investor"]),
  async (req, res) => {
    try {
      const [ideas] = await db.query(`
        SELECT 
          i.idea_id,
          i.student_id,
          i.title,
          i.description,
          i.status,
          u.name AS student_name,
          u.email AS student_email
        FROM ideas i
        JOIN users u ON i.student_id = u.user_id
        WHERE i.status = 'approved'
        ORDER BY i.idea_id DESC
      `);

      res.status(200).json({
        count: ideas.length,
        ideas
      });
    } catch (err) {
      console.error("❌ Investor Approved Route Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * Express Interest
 */
router.post(
  "/interest/:id",
  authMiddleware,
  requireRole(["investor"]),
  async (req, res) => {
    try {
      const ideaId = req.params.id;
      const investorId = req.user.id;

      // Get student_id
      const [[idea]] = await db.query(
        "SELECT student_id FROM ideas WHERE idea_id = ?",
        [ideaId]
      );

      if (!idea) {
        return res.status(404).json({ error: "Idea not found" });
      }

      const studentId = idea.student_id;

      // Prevent duplicate interest
      const [[exists]] = await db.query(
        "SELECT 1 FROM interest WHERE idea_id = ? AND investor_id = ?",
        [ideaId, investorId]
      );

      if (exists) {
        return res.status(400).json({ error: "Already expressed interest" });
      }

      // Save interest
      await db.query(
        "INSERT INTO interest (idea_id, investor_id) VALUES (?, ?)",
        [ideaId, investorId]
      );

      // Notify student
      await db.query(
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
        [
          studentId,
          "📩 An investor is interested in your idea! You can start a chat."
        ]
      );

      res.status(201).json({
        success: true,
        message: "Interest sent and student notified"
      });
    } catch (err) {
      console.error("❌ Express Interest Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
