const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let filaSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  description: {
    type: String,
    required: [true, "Incluya una descripción para la fila."]
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El usuario es necesario"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"]
  },
  resumen: {
    ultimo: Number,
    hoy: Number
  },
  ultimos4: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ticket"
    }
  ],
  escritorios: [
    {
      type: Schema.Types.ObjectId,
      ref: "Escritorio"
    }
  ],
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ticket"
    }
  ]
});

filaSchema.methods.encryptPassword = async password => {
  return await bcrypt.hash(password, 10);
};

filaSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

filaSchema.methods.toJSON = function() {
  let fila = this;
  let filaObject = fila.toObject();
  delete filaObject.password;

  return filaObject;
};

filaSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Fila", filaSchema);
