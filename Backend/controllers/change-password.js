const pool = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [req.user.id]
    );

    const user = rows[0];

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [hashed, req.user.id]
    );

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};