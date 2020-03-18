const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("../config/vars");

// Routes
const routes = require("../routes");
const auth = require("../middlewares/auth");

/**
 * Express instance
 * @public
 */
const app = express();
// request logging. dev: console | production: file
app.use(morgan(config.logs));

// secure apps by setting various HTTP headers
app.use(helmet());

app.use(express.json());

// mount
app.use("/docs", express.static("doc"));

// mount api v1 routes
app.use("/", auth, routes);

module.exports = app;
