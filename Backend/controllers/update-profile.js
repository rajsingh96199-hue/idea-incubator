const pool = require("../config/db");

module.exports = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "All fields required" });
    }

    await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE user_id = ?",
      [name, email, req.user.id]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};