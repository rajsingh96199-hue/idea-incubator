const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  console.log("🔍 AUTH HEADER:", req.headers.authorization);

  const header = req.headers.authorization;
  if (!header) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    console.log("❌ Invalid token format");
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ JWT DECODED:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    console.log("🔐 ROLE CHECK:", req.user?.role, "required:", roles);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: Insufficient role" });
    }
    next();
  };
};
