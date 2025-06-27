const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: "https://todo-app-five-zeta-38.vercel.app",
  credentials: true,
}));



// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const todoRoutes = require("./routes/todos");
app.use("/api/todos", todoRoutes);

// DB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


