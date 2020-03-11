const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.SchemaTypes.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
module.exports.userSchema = userSchema;
