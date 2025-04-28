import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import allRoutes from "./routes/index.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyToken } from "./middleware/auth.js";

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    abortOnLimit: true,
  })
);

// Routes
app.use("/api", allRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

export default app;
