const jwt = require("jsonwebtoken");
const userDetails = require("../model/userSchema");

async function requireAdmin(req, res, next) {
  const authorization = req.get("authorization");
  const bearerToken =
    authorization && authorization.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : "";
  const token = bearerToken || req.get("token");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    return res.status(503).json({ error: "Menu administration is not configured" });
  }

  if (!process.env.SECRET_KEY) {
    console.error("Admin authentication requires SECRET_KEY in Backend/.env");
    return res.status(503).json({ error: "Authentication is not configured" });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userDetails.findOne({ token });

    if (!user || typeof payload === "string" || payload.email !== user.email) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    if (!adminEmails.includes(user.email.trim().toLowerCase())) {
      return res.status(403).json({ error: "Administrator access required" });
    }

    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid authentication token" });
    }
    console.error("Admin authentication failed:", error);
    return res.status(500).json({ error: "Admin authentication failed" });
  }
}

module.exports = requireAdmin;
