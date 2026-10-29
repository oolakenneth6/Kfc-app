const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const connection = require("./Database/db");
const userAuthRouter = require("./routes/userAuth.route");
const paymentRouter = require("./routes/paymentIntegrate.route");
const menuRouter = require("./routes/menu.route");
const cartRouter = require("./routes/cart.route");
const searchRouter = require("./routes/serach.route");
const landingRouter = require("./routes/landing.route");
const cors = require("cors");
const helmet = require("helmet");

const server = express();
const PORT = process.env.PORT || 8081;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PREVIEW_URL,
].filter(Boolean);

server.disable("x-powered-by");
server.use(helmet());
server.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: "1mb" }));

server.get("/", (req, res) => {
  res.status(200).json({
    message: "KFC API server is running",
    status: "ok",
  });
});

server.get("/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "degraded",
    database: databaseReady ? "connected" : "disconnected",
  });
});

server.use("/Auth", userAuthRouter);
server.use("/api/home", landingRouter);
server.use("/api/searchapi", searchRouter);
server.use("/api/product", menuRouter);
server.use("/api/productcart", cartRouter);
server.use("/api/payment", paymentRouter);

server.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

server.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({ message: "Request origin is not allowed" });
  }

  console.error("API error:", err.message);
  return res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  try {
    await connection;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`KFC API server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exitCode = 1;
  }
}

startServer();
