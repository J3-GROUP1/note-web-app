const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// Import your routes (replace with your actual route file)
const authRoutes = require("../routes/auth");

const app = express();
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

describe("Form Validation Tests", () => {
  it("should return 400 if username is missing", async () => {
    const response = await request(app)
      .post("/api/auth/create-account") // Updated endpoint
      .send({ password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Username is required");
  });

  it("should return 400 if password is too short", async () => {
    const response = await request(app)
      .post("/api/auth/create-account") // Updated endpoint
      .send({ username: "testuser", password: "123" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Password must be at least 6 characters long"
    );
  });

  it("should return 201 for valid registration data", async () => {
    const response = await request(app)
      .post("/api/auth/create-account") // Updated endpoint
      .send({ username: "testuser", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User registered successfully"
    );
  });
});
