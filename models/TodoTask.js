const mongoose = require("mongoose");
const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  done: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("TodoTask", todoTaskSchema);
