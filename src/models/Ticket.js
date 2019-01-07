const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let ticketSchema = new Schema({
  numero: {
    type: Number,
    required: [true, "El ticket debe tener un número por obligación."]
  },
  atendido: {
      type: Boolean,
      required: false,
      default: false,
  },
  escritorio: {
    type: Number,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  fila: {
      type: Schema.Types.ObjectId,
      ref: "Fila",
      required: false
  }
});

ticketSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Ticket", ticketSchema);
