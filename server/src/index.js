import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createPlanRouter } from "./routes/plans.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "8mb" }));

app.get("/", (_req, res) => {
  res.json({ message: "Server working" });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "care-planner-api",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/plans", createPlanRouter());

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "The server could not complete the request.",
    details: "Please review the inputs and try again."
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Care Planner API running on port ${port}`);
});