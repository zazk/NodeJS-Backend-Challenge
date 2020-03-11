const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Articles = require("../models/articles");
const Users = require("../models/users");

// Getting all Articles
router.get("/", async (req, res) => {
  try {
    const articles = await Articles.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one article
router.post("/", checkUserId, async (req, res) => {
  const article = new Articles({
    userId: res.user._id,
    title: req.body.title,
    text: req.body.text,
    tags: req.body.tags,
    _id: new mongoose.Types.ObjectId()
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function checkUserId(req, res, next) {
  try {
    const userId =
      !!res.article && ["POST", "PATCH"].includes(req.method)
        ? res.article.userId
        : null;
    user = await Users.findById(req.body.userId || userId);
    if (user == null) {
      return res
        .status(400)
        .json({ message: `User with id ${req.body.userId} does not exist` });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
