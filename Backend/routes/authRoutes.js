const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile (NEW)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Profile OK", user: req.user });
});

module.exports = router;
