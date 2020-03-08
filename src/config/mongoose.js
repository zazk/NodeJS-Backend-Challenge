const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("./vars");

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;
// mongoose.set('debug', true);
mongoose.set("useUnifiedTopology", true);

// Exit application on error
mongoose.connection.on("error", err => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (config.env === "development") {
  mongoose.set("debug", true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose.connect(config.mongo.uri, {
    keepAlive: 1,
    useNewUrlParser: true
  });
  return mongoose.connection;
};

exports.disconnect = () => {
  mongoose.disconnect();
};
