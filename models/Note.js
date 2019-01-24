var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var monSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review"
  }
});

var Note = mongoose.model("Note", monSchema);

// To export module
module.exports = Note;
