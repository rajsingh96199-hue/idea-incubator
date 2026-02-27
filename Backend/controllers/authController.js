const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====================== REGISTER ======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ error: "Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "student"]
    );

    return res.json({ success: true, message: "User registered successfully!" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// ====================== LOGIN ======================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0)
      return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
  { id: user[0].user_id, role: user[0].role },
  process.env.JWT_SECRET,
  { expiresIn: "2h" }
);

return res.json({
  success: true,
  message: "Login successful",
  role: user[0].role,
  token
});


  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
