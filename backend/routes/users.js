const express = require("express");
const User = require("../models/user.model");
const { authenticateToken } = require("../utils");

const router = express.Router();

// Get User
router.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const isUser = await User.findOne({ _id: user.user._id });

    if (!isUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully!",
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        id: isUser._id,
        createdOn: isUser.createdOn,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

module.exports = router;
