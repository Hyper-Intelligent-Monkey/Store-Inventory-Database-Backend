const jwt = require("jsonwebtoken");
const Supplier = require("../models/supplierModel");

module.exports = async function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const supplier = await Supplier.findById(decoded.id);

    if (!supplier) return res.status(401).json({ error: "Invalid supplier token" });

    req.supplier = supplier; // attach supplier to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

