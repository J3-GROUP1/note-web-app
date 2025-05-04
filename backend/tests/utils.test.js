require("dotenv").config();
const request = require("supertest");
const express = require("express");
const { authenticateToken } = require("../utils");
const jwt = require("jsonwebtoken");

const app = express();

// Mock route to test the middleware
app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
});

describe("authenticateToken middleware", () => {
  const validToken = jwt.sign(
    { username: "testuser" },
    process.env.ACCESS_TOKEN_SECRET
  );

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/protected");
    expect(response.status).toBe(401);
  });

  it("should return 401 if the token is invalid", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.status).toBe(401);
  });

  it("should call next() and grant access if the token is valid", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Access granted",
      user: expect.objectContaining({ username: "testuser" }),
    });
  });
});
