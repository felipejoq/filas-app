const router = require("express").Router();
const Fila = require("../models/Fila");
const Usuario = require("../models/User");
const bcrypt = require('bcryptjs');

const { estaAutenticado, estaVerificado} = require("../middlewares/auth");
const { puedeCrear } = require("../middlewares/fila");

router.get("/user/filas", [estaAutenticado, estaVerificado], (req, res) => {
  Fila.find({ usuario: req.user._id }, (err, filasDB) => {
    if (err) {
      req.flash("error_msg", "Algo pasó al obtener las filas");
      res.redirect("back");
    }

    const filas = filasDB;

    console.log(filas.length);

    res.render("filas/filas-list", { filas });
  });
});

router.post("/user/filas", [estaAutenticado, estaVerificado, puedeCrear], async (req, res) => {

  const {name, description, password } = req.body

  if (name.trim().length === 0 || password.trim().length === 0) {
    req.flash("error_msg", "El nombre y la clave no puede estar vacío.");
    return res.redirect("back");
  } else if (name.trim().length < 5) {
    req.flash(
      "error_msg",
      "Incluya un nombre de la fila más largo (Mínimo 5 carácteres)"
    );
    return res.redirect("back");
  }

  const nuevaFila = new Fila({
    name: name,
    description: description,
    tickets: [],
    escritorios: [],
    password: password,
    usuario: req.user._id
  });

  nuevaFila.resumen = {
    ultimo: 0,
    hoy: new Date().getDate()
  }

  nuevaFila.password = await nuevaFila.encryptPassword(nuevaFila.password);
  
  nuevaFila.save((err, filaDB) => {
    if (err) {
      req.flash("error_msg", "Hubo un error al crear la fila. " + err);
      return res.redirect("back");
    }

    Usuario.findOne({_id:req.user._id}, (err, userDB) => {
        userDB.filas.push(filaDB._id);
        userDB.save();
    });

    req.flash("exito_msg", "La fila fue creada con éxito!");
    return res.redirect("/user/filas");
  });
});

router.get("/user/filas/:id", [estaAutenticado, estaVerificado], (req, res) => {

  Fila.findOne({_id: req.params.id}, (err, filaDB) => {
    if (err) {
      req.flash("error_msg", "Hay un error al buscar la fila.");
      return res.redirect("/user/perfil");
    }

    if(!filaDB){
      req.flash("error_msg", "Algo salió mal, intente de nuevo por favor.");
      return res.redirect("/user/perfil");
    }

    res.render("filas/filas-edit", {filaDB});
  });
});

router.put("/user/filas/:id", [estaAutenticado, estaVerificado], async (req, res) => {
  const { name, description, password, editapassword } = req.body;

  if (name.trim().length === 0) {
    req.flash("error_msg", "El nombre no puede estar vacío.");
    return res.redirect("back"); 
  } else if (name.trim().length < 5) {
    req.flash(
      "error_msg",
      "Incluya un nombre de la fila más largo (Mínimo 5 carácteres)"
    );
    return res.redirect("back");
  }

  const camposEditar = {
    name: name,
    description: description
  }

  console.log('Quiere editar el password también: ', editapassword);

  if(editapassword){
    camposEditar.password = await bcrypt.hashSync(password);
  }

  Fila.findOneAndUpdate({_id: req.params.id}, camposEditar, (err, filaUpdate) => {
    if (err) {
      req.flash("error_msg", "Hubo un error al editar la fila. " + err);
      res.redirect("/user/filas");
    }

    req.flash("exito_msg", "La fila fue editada con éxito!");
    res.redirect("/user/filas");
  });
});

router.get('/user/filas/delete/:id', [estaAutenticado, estaVerificado], (req, res) => {
    Fila.findOneAndDelete({_id: req.params.id}, (err, filaDel) => {
      if (err) {
        req.flash("error_msg", "Hubo un error al eliminar la fila. " + err);
        return res.redirect("/user/filas");
      }
  
      req.flash("exito_msg", "La fila fue eliminada con éxito!");
      res.redirect("/user/perfil");
    });
});

module.exports = router;
