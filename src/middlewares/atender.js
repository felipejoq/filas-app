const atender = {};
const Fila = require("../models/Fila");

atender.puedeAtender = (req, res, next) => {
  const { number, password } = req.body;
  const fila_id = req.params.id_fila;

  if (number.trim().length === 0) {
    req.flash("error_msg", "Datos incorrectos o incompletos");
    return res.redirect("/atender/fila/" + fila_id);
  }

  Fila.findById(fila_id)
    .populate("escritorios")
    .exec(async (err, fila) => {
      const passCorrecta = await fila.comparePassword(password);
      if (!passCorrecta) {
        req.flash("error_msg", "Datos incorrectos - Password");
        return res.redirect("/atender/fila/" + fila_id);
      }

      for (let i = 0; i < fila.escritorios.length; i++) {
        if (fila.escritorios[i].number === number) {
          console.log(true);
          return next();
        } else {
          console.log(false);
        }
      }
      req.flash("error_msg", "Datos incorrectos o incompletos");
      return res.redirect("/atender/fila/" + fila_id);
    });
};

module.exports = atender;
