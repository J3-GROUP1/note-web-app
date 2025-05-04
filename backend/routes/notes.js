const express = require("express");
const Note = require("../models/note.model");
const { authenticateToken } = require("../utils");

const router = express.Router();

// Add Note
router.post("/add-note", authenticateToken, async (req, res) => {
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
router.put("/edit-note/:id", authenticateToken, async (req, res) => {
  const noteId = req.params.id;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

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
router.get("/get-all-notes", authenticateToken, async (req, res) => {
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
router.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
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
router.put(
  "/update-note-pinned/:noteId",
  authenticateToken,
  async (req, res) => {
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
  }
);

// Search notes
router.get("/search-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      error: true,
      message: "Search query is required!",
    });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user.user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.status(200).json({
      error: false,
      message: "Notes matching the query retrieved successfully!",
      notes: matchingNotes,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error!",
    });
  }
});

module.exports = router;
