// import path from 'path';
const dotenv = require("dotenv-safe");

// import .env variables
dotenv.config({
  allowEmptyValues: true
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  mongo: {
    uri: process.env.MONGO_URI || ""
  },
  jwt: {
    secret: process.env.API_AUTH_TOKEN || "",
    expirationTime: process.env.JWT_EXPIRATION_TIME || 60 // Minutes
  }
};
