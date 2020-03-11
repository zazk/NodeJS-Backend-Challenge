const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/users");

// Getting all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one user
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    avatar: req.body.avatar,
    _id: new mongoose.Types.ObjectId()
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
