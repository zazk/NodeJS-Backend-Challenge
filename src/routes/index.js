const express = require("express");

// Routes
const userRoutes = require("./users");
const articlesRoutes = require("./articles");

// Router
const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

// Custom Routes
router.use("/users", userRoutes);
router.use("/articles", articlesRoutes);

module.exports = router;
