const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ user, token });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();

  const token = generateToken(user);
  res.status(201).json({ user, token });
});

router.post("/google", async (req, res) => {
  const { name, email, googleId } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ name, email, googleId });
    await user.save();
  }

  const token = generateToken(user);
  res.json({ user, token });
});

module.exports = router;
