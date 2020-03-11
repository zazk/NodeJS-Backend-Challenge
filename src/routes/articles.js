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

// Getting all Articles by tag
router.get("/search", async (req, res) => {
  try {
    const articles = await Articles.find({ tags: { $in: req.query.tag } });
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

// Getting one article
router.get("/:id", getArticle, (req, res) => {
  res.json(res.article);
});

// Updating one article
router.put("/:id", getArticle, checkUserId, async (req, res) => {
  res.article.userId = res.user._id;
  res.article.title = req.body.title;
  res.article.text = req.body.text;
  res.article.tags = req.body.tags;
  try {
    const updatedArticles = await res.article.save();
    res.json(updatedArticles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Partial updating one article
router.patch("/:id", getArticle, checkUserId, async (req, res) => {
  if (req.body.userId != null) {
    res.article.userId = req.body.userId;
  }
  if (req.body.title != null) {
    res.article.title = req.body.title;
  }
  if (req.body.text != null) {
    res.article.text = req.body.text;
  }
  if (req.body.tags != null) {
    res.article.tags = req.body.tags;
  }

  try {
    const updatedArticles = await res.article.save();
    res.json(updatedArticles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Deleting one user
router.delete("/:id", getArticle, async (req, res) => {
  try {
    await res.article.remove();
    res.json({ message: "Deleted This Article" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function for gettig article object by ID
async function getArticle(req, res, next) {
  try {
    article = await Articles.findById(req.params.id);
    if (article == null) {
      return res.status(404).json({ message: "Cant find article" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.article = article;
  next();
}

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
