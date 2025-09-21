// server.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import timeout from "connect-timeout";

import route from "./routes/route.js";
import blogRouter from "./routes/blogRouter.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(compression()); 

// ---------- Middleware ----------
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://real-estate-iul2.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
  
app.use(helmet());        // security headers
app.use(morgan("dev"));   // request logging
app.use(timeout("30s"));  // request timeout

mongoose.set("strictQuery", true); 
// ---------- DB Connection ----------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // stop app if DB fails
  }
};
connectDB();

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

app.use("/api/properties", route);
app.use("/api/blog", blogRouter);

// ---------- Error Handling ----------
app.use(errorHandler);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
