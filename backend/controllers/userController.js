const mongoose = require("mongoose");
const User = require("../models/userModel");

// Generate random user_id similar to existing format (26 characters, uppercase alphanumeric)
const generateUserId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let userId = "";
  for (let i = 0; i < 26; i++) {
    userId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return userId;
};

exports.signup = async (req, res) => {
  try {
    const { reviewerName, age, gender, address } = req.body;

    // Validation
    if (!reviewerName || !age || !gender || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (gender !== "Male" && gender !== "Female") {
      return res.status(400).json({ message: "Gender must be Male or Female" });
    }

    // Convert age to number for validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return res
        .status(400)
        .json({ message: "Age must be a number between 1 and 120" });
    }

    // Generate unique user_id
    let user_id;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      user_id = generateUserId();
      const existingUser = await User.findOne({ user_id });
      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res
        .status(500)
        .json({ message: "Failed to generate unique user ID" });
    }

    console.log("Generated user_id:", user_id);

    // Create new user
    const newUser = new User({
      user_id,
      reviewerName,
      age: ageNum,
      gender,
      address,
      likedProducts: [],
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors,
    });
    res.status(500).json({
      message: "Server Error",
      error: error.message,
      details: error.errors || error,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.toggleLikeProduct = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { asin } = req.body;
    const isLiked = user.likedProducts.includes(asin);
    if (isLiked) {
      user.likedProducts = user.likedProducts.filter((id) => id !== asin);
    } else {
      user.likedProducts.push(asin);
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
