require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { authenticateToken } = require("../utils");

const router = express.Router();

// Create Account
router.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full name is required!" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required!" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required!" });
  }

  try {
    const isUser = await User.findOne({ email: email });

    if (isUser) {
      return res.status(400).json({
        error: true,
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000s",
    });

    return res.status(201).json({
      error: false,
      user,
      accessToken,
      message: "Registration Successful!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required!" });
  }

  try {
    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userInfo.password); // Compare the hashed password

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Password is incorrect!",
      });
    }

    const user = { user: userInfo };
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "4h",
    });

    return res.status(200).json({
      error: false,
      message: "Login Successful!",
      email,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

module.exports = router;
