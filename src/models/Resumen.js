const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let resumenSchema = new Schema({
  ultimo: {
    type: Number
  },
  fecha:{
      type: Date,
      default: Date.now
  },
  ultimos4: [{
    type: Schema.Types.ObjectId,
    ref: "Ticket",
  }]
});

escritorioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Escritorio", escritorioSchema);