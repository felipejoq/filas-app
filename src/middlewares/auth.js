const auth = {};
const Fila = require("../models/Fila");

auth.estaAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("Usuario logeado: ", req.isAuthenticated());
    return next();
  }
  req.flash("error_msg", "Usted no está autorizado, debe conectarse primero.");
  res.redirect("/ingresar");
};

auth.noAutenticado = (req, res, next) => {
  if (req.isUnauthenticated()) {
    return next();
  }
  res.redirect("/user/perfil");
};

auth.estaVerificado = (req, res, next) => {
  if (req.user.verificado) {
    console.log("Su cuenta está verificada así que puede");
    return next();
  }

  req.flash("error_msg", "Primero debe verificar su cuenta.");
  res.redirect("/user/perfil");
};

auth.noVerificado = (req, res, next) => {
  if (!req.user.verificado) {
    console.log("Sí, debe verificar su cuenta.");
    return next();
  }

  req.flash("exito_msg", "Su cuenta ya está verificada :)");
  res.redirect("/user/perfil");
};

auth.lePertenece = (req, res, next) => {
  Fila.findOne({ usuario: req.user._id }, (err, fila) => {
    if (err) {
      console.log('No está autorizado porque hubo un error');
      req.flash("exito_msg", "Hubo un error");
      return res.redirect("/user/perfil");
    }

    if(!fila){
      console.log('No está autorizado porque no tiene una fila que coincida con su id');
        req.flash("exito_msg", "No está autorizado");
        return res.redirect("/user/perfil");
    }

    return next();
  });
};

module.exports = auth;
