require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./config.json");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const noteRoutes = require("./routes/notes");

mongoose.connect(config.connectionString);

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json()); // Added middleware to parse JSON request bodies

app.get("/", (req, res) => {
  res.json({ data: "Hello from the backend!" });
});

// Use modularized routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
