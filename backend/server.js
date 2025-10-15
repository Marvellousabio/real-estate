import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import timeout from "connect-timeout";
import mongoose from "mongoose";

import propertyRoutes from "./routes/route.js";
import blogRoutes from "./routes/blogRouter.js";
import authRouter from "./routes/authRouter.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware Configuration ----------
app.use(compression());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://real-estate-iul2.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan("combined"));
app.use(timeout("30s"));

// ---------- Database Connection ----------
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// ---------- Routes ----------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Real Estate API is running 🚀",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRoutes);
app.use("/api/blog", blogRoutes);

// ---------- Error Handling ----------
app.use(errorHandler);

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

