const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow all origins
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send(`
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f6fa;font-family:sans-serif;">
      <div style="padding:2em 3em;background:white;border-radius:1em;box-shadow:0 2px 12px #0001;text-align:center;">
        <h1 style="color:#246bfd;margin-bottom:0.5em;">Welcome to NextSocial server 🚀</h1>
        <p style="font-size:1.2em;color:#222;margin-bottom:1em;">
          The backend is running!<br>
          <a href="https://recommender-system-seven.vercel.app/" target="_blank" style="display:inline-block;margin-top:1em;padding:0.6em 1.4em;background:#246bfd;color:#fff;border-radius:2em;text-decoration:none;font-weight:600;transition:background 0.2s;">Click here to visit the live website</a>
        </p>
      </div>
    </div>
  `);
});

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
