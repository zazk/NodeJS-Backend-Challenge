const config = require("./config/vars");
const app = require("./config/express");
const mongoose = require("./config/mongoose");

// Routes
const routes = require("./routes");

// open mongoose connection
mongoose.connect();

// listen to requests
const server = app.listen(config.port, () => {
  console.log("Server running 🚀 👽 🌌");
  console.log(`  * Env  : ${config.env}`);
  console.log(`  * Port : ${config.port}`);
  console.log(`  * DB   : ${config.mongo.uri}`);
});

module.exports = server;
