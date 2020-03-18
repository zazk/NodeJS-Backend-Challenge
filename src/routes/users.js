const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/users");

/**
 * @api {get} /users List of Users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiUse AuthTokenHeader
 *
 * @apiSuccess {Object[]} users  List of users.
 * @apiSuccess {String} users._id  users UUID
 * @apiSuccess {String} users.name  Name of User.
 * @apiSuccess {String} users.avatar  Avatar Link.
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @api {post} /users Create a new User
 * @apiName CreateUsers
 * @apiGroup Users
 * @apiUse AuthTokenHeader
 *
 * @apiParam {Object} user  User Object.
 * @apiParam {String} user.name  Name of User.
 * @apiParam {String} user.avatar  Avatar Link.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "name": "John",
 *       "avatar": "https//someserver.com/linkto-img.jpg"
 *     }
 */
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

/**
 * @api {get} /users/:id Retrieve User
 * @apiName RetrieveUser
 * @apiGroup Users
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of User.
 *
 * @apiSuccess {Object} user  User Object.
 * @apiSuccess {String} user.name  Name of User.
 * @apiSuccess {String} user.avatar  Avatar Link.
 */
router.get("/:id", getUsers, (req, res) => {
  res.json(res.user);
});

/**
 * @api {put} /users/:id Update User
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of User.
 *
 * @apiParam {Object} user  User Object.
 * @apiParam {String} user.name  Name of User.
 * @apiParam {String} user.avatar  Avatar Link.
 *
 * @apiSuccess {Object} user  User Object.
 * @apiSuccess {String} user.name  Name of User.
 * @apiSuccess {String} user.avatar  Avatar Link.
 */
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

/**
 * @api {patch} /users/:id Partial update User
 * @apiName PartialUpdateUser
 * @apiGroup Users
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of User.
 *
 * @apiParam {Object} user  User Object.
 * @apiParam {String} [user.name]  Name of User.
 * @apiParam {String} [user.avatar]  Avatar Link.
 *
 * @apiSuccess {Object} user  User Object.
 * @apiSuccess {String} user.name  Name of User.
 * @apiSuccess {String} user.avatar  Avatar Link.
 */
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

/**
 * @api {delete} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiUse AuthTokenHeader
 *
 * @apiParam {String} id ID of User.
 *
 * @apiSuccess {Object} user  User Object.
 * @apiSuccess {String} user.name  Name of User.
 * @apiSuccess {String} user.avatar  Avatar Link.
 */
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
