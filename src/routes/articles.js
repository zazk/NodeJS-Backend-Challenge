const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Articles = require("../models/articles");
const Users = require("../models/users");

/**
 * @apiDefine AuthTokenHeader
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "5CD4ED173E1C95FE763B753A297D5"
 *     }
 */

/**
 * @api {get} /articles List of Articles
 * @apiName GetArticles
 * @apiGroup Articles
 *
 * @apiUse AuthTokenHeader
 *
 * @apiSuccess {Object[]} articles  List of articles.
 * @apiSuccess {String} articles._id  Articles UUID
 * @apiSuccess {String} articles.title  Title of Article.
 * @apiSuccess {String} articles.text  Body of Article.
 * @apiSuccess {[String]} articles.tags  Tags related of Article.
 */
router.get("/", async (req, res) => {
  try {
    const articles = await Articles.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @api {get} /articles/search?tag=:tag Search Articles related to some tags
 * @apiName SearchArticles
 * @apiGroup Articles
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} tag Tags to search.
 *
 * @apiSuccess {Object[]} articles  List of articles.
 * @apiSuccess {String} articles._id  Articles UUID
 * @apiSuccess {String} articles.title  Title of Article.
 * @apiSuccess {String} articles.text  Body of Article.
 * @apiSuccess {[String]} articles.tags  Tags related of Article.
 */
router.get("/search", async (req, res) => {
  try {
    const articles = await Articles.find({ tags: { $in: req.query.tag } });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @api {post} /articles Create Article
 * @apiName CreateArticle
 * @apiGroup Articles
 * @apiUse AuthTokenHeader
 * 
 * @apiParam {Object} article  Object for new article.
 * @apiParam {String} article._id  Articles UUID
 * @apiParam {String} article.title  Title of Article.
 * @apiParam {String} article.text  Body of Article.
 * @apiParam {[String]} article.tags  Tags related of Article.
 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "_id": "<uuid-code>",
 *       "title": "Some Title",
 *       "text": "Some Text",
 *       "tags": ["Some-Tag", "Some-Othe-Tag"]
 *     }
 */
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

/**
 * @api {get} /articles/:id Retrieve Article by ID
 * @apiName RetrieveArticle
 * @apiGroup Articles
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of Article.
 *
 * @apiSuccess {Object} article  Article Object.
 * @apiSuccess {String} article._id  Articles UUID
 * @apiSuccess {String} article.title  Title of Article.
 * @apiSuccess {String} article.text  Body of Article.
 * @apiSuccess {[String]} article.tags  Tags related of Article.
 */
router.get("/:id", getArticle, (req, res) => {
  res.json(res.article);
});

/**
 * @api {put} /articles/:id Update Article
 * @apiName UpdateArticle
 * @apiGroup Articles
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of Article.
 *
 * @apiParam {Object} article  Object article.
 * @apiParam {String} article._id  Articles UUID
 * @apiParam {String} article.title  Title of Article.
 * @apiParam {String} article.text  Body of Article.
 * @apiParam {[String]} article.tags  Tags related of Article.
 *
 * @apiSuccess {Object} article  Article Object.
 * @apiSuccess {String} article._id  Articles UUID
 * @apiSuccess {String} article.title  Title of Article.
 * @apiSuccess {String} article.text  Body of Article.
 * @apiSuccess {[String]} article.tags  Tags related of Article.
 */
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

/**
 * @api {path} /articles/:id Partial Update of Article
 * @apiName PatchArticle
 * @apiGroup Articles
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of Article.
 *
 * @apiParam {Object} article  Object article.
 * @apiParam {String} [article.title]  Title of Article.
 * @apiParam {String} [article.text]  Body of Article.
 * @apiParam {[String]} [article.tags]  Tags related of Article.
 *
 * @apiSuccess {Object} article  Article Object.
 * @apiSuccess {String} article._id  Articles UUID
 * @apiSuccess {String} article.title  Title of Article.
 * @apiSuccess {String} article.text  Body of Article.
 * @apiSuccess {[String]} article.tags  Tags related of Article.
 */
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

/**
 * @api {delete} /articles/:id Delete Article
 * @apiName RetrieveArticle
 * @apiGroup Articles
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of Article.
 */
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
