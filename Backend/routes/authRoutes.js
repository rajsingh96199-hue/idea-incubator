const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

const updateProfile = require("../controllers/update-profile");
const changePassword = require("../controllers/change-password");

const { authMiddleware } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Profile OK", user: req.user });
});

// Update Profile
router.put("/update-profile", authMiddleware, updateProfile);

// Change Password
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;