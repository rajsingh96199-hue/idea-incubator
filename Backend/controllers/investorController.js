const db = require("../config/db");

// GET approved ideas list
exports.showApproved = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM ideas WHERE status = 'approved'"
    );
    res.json({ approved: rows });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST Express interest
exports.expressInterest = async (req, res) => {
  try {
    const investorId = req.user.id;
    const ideaId = req.params.id;

    await db.query(
      "INSERT INTO investor_interests (investor_id, idea_id) VALUES (?, ?)",
      [investorId, ideaId]
    );

    res.json({ message: "Interest recorded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
