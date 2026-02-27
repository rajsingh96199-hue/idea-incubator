const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const db = require("../config/db");

/**
 * 🔍 GET PENDING IDEAS (Mentor)
 */
router.get(
  "/ideas",
  authMiddleware,
  requireRole(["mentor", "admin"]),
  async (req, res) => {
    try {
      const [ideas] = await db.execute(`
        SELECT 
          i.idea_id,
          i.title,
          i.description,
          i.status,
          u.name AS student_name,
          u.email AS student_email
        FROM ideas i
        JOIN users u ON i.student_id = u.user_id
        WHERE i.status = 'pending'
        ORDER BY i.created_at DESC
      `);

      res.json({ ideas });
    } catch (err) {
      console.error("Mentor GET ideas error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * ✅ REVIEW IDEA + SEND NOTIFICATION
 */
router.put(
  "/review/:id",
  authMiddleware,
  requireRole(["mentor", "admin"]),
  async (req, res) => {
    const { status, feedback } = req.body;
    const ideaId = req.params.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      // 1️⃣ Get idea + student
      const [ideas] = await db.query(
        "SELECT title, student_id FROM ideas WHERE idea_id = ?",
        [ideaId]
      );

      if (ideas.length === 0) {
        return res.status(404).json({ error: "Idea not found" });
      }

      const { title, student_id } = ideas[0];

      console.log("📌 Student ID:", student_id);

      // 2️⃣ Update idea
      await db.query(
        "UPDATE ideas SET status=?, mentor_feedback=? WHERE idea_id=?",
        [status, feedback || null, ideaId]
      );

      // 3️⃣ Create notification (NO FK drama)
      const message =
        status === "approved"
          ? `✅ Your idea "${title}" was approved by a mentor`
          : `❌ Your idea "${title}" was rejected. Feedback: ${feedback || "No feedback"}`;

      await db.query(
  "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
  [student_id, message]
);



      res.json({
        success: true,
        message: "Review saved and student notified"
      });

    } catch (err) {
      console.error("🔥 Mentor review error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/history",
  authMiddleware,
  requireRole(["mentor", "admin"]),
  async (req, res) => {
    try {
      const [ideas] = await db.query(`
        SELECT 
          i.idea_id,
          i.title,
          i.description,
          i.status,
          i.mentor_feedback,
          u.name AS student_name
        FROM ideas i
        JOIN users u ON i.student_id = u.user_id
        WHERE i.status IN ('approved', 'rejected')
        ORDER BY i.created_at DESC
      `);

      res.json({ ideas });
    } catch (err) {
      console.error("Mentor history error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;