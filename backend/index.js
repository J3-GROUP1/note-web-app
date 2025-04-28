require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

// Import models
const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Added bcrypt for password hashing

const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json()); // Added middleware to parse JSON request bodies

app.get("/", (req, res) => {
  res.json({ data: "Hello from the backend!" });
});

// Create Account
app.post("/create-account", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
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

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required!" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required!" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user.user._id,
    });

    await note.save();

    return res.status(201).json({
      error: false,
      message: "Note added successfully!",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Edit Note
app.put("/edit-note/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOneAndUpdate({
      _id: noteId,
      userId: user.user._id,
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found!",
      });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      error: false,
      message: "Note updated successfully!",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user.user._id }).sort({
      isPinned: -1,
    });

    return res.status(200).json({
      error: false,
      message: "All Notes retrieved successfully!",
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({
      _id: noteId,
      userId: user.user._id,
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found!",
      });
    }

    await Note.deleteOne({ _id: noteId, userId: user.user._id });

    return res.status(200).json({
      error: false,
      message: "Note deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

// Update isPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user.user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found!",
      });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      error: false,
      message: "Note updated successfully!",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;