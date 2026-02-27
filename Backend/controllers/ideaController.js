const db = require("../config/db");

exports.createIdea = async (req, res) => {
  try {
    const { title, description } = req.body;
    const student_id = req.user.id; // from JWT token

    if (!title || !description)
      return res.status(400).json({ error: "All fields are required" });

    const [result] = await db.execute(
      "INSERT INTO ideas (student_id, title, description) VALUES (?, ?, ?)",
      [student_id, title, description]
    );

    res.status(201).json({
      message: "Idea submitted successfully 🚀",
      idea_id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
