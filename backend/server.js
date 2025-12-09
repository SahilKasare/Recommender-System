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

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
