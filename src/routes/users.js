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

// Getting one user
router.get("/:id", getUsers, (req, res) => {
  res.json(res.user);
});

// Updating one user
router.put("/:id", getUsers, async (req, res) => {
  res.user.name = req.body.name;
  res.user.avatar = req.body.avatar;
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Partial updating one user
router.patch("/:id", getUsers, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }

  if (req.body.avatar != null) {
    res.user.avatar = req.body.avatar;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Deleting one user
router.delete("/:id", getUsers, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted This User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function for gettig user object by ID
async function getUsers(req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cant find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
