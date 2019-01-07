const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let escritorioSchema = new Schema({
  number: {
      type: String,
      required: [true, 'El nombre o número del escritorio es obligatoria.'],
      default: false,
  },
  description: {
    type: String,
    required: [true, "El escritorio debe tener una descripcion."]
  },
  fila: {
      type: Schema.Types.ObjectId,
      ref: "Fila",
      required: false
  },
});

escritorioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Escritorio", escritorioSchema);