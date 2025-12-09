const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, unique: true },
    reviewerName: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female"] },
    address: { type: String },
    likedProducts: [{ type: String }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
