const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  _id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  }
});

module.exports = mongoose.model("Article", articleSchema);
