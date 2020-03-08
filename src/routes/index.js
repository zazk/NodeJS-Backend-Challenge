const express = require("express");

// Router
const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

module.exports = router;
