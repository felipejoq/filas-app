const router = require("express").Router();
const Usuario = require("../models/User");
const mails = require('../helpers/mails/verifica-cuenta');
const passport = require('passport');
const { estaAutenticado, noAutenticado } = require('../middlewares/auth');
const { randomString } = require('../helpers/helpers');
const Fila = require('../models/Fila');

router.get("/registrarse", noAutenticado, (req, res) => {
  //REGISTRO DESHABILITADO POR DEMO
    return res.render("users/registrarse2", { title: 'Registrarse'});
    // return res.render("users/registrarse", { title: 'Registrarse'});
  
});

router.post("/registrarse", noAutenticado, async (req, res) => {
  // const { name, email, password, password2 } = req.body;

  // const errors = [];

  // if (name.trim().length <= 0) {
  //   errors.push({
  //     mensaje: "Debe incluir su nombre en el formulario."
  //   });
  // }

  // if (email.trim().length <= 0) {
  //   errors.push({
  //     mensaje: "Debe incluir un correo válido en el formulario."
  //   });
  // }

  // if (password !== password2) {
  //   errors.push({
  //     mensaje: "Las contraseñas no coinciden"
  //   });
  // }
  // if (password.length < 3) {
  //   errors.push({
  //     mensaje: "La contraseña al menos debe tener más de 3 caracteres."
  //   });
  // }

  // if (errors.length > 0) {
  //   res.render("users/registrarse", {
  //     errors,
  //     name,
  //     email,
  //     password,
  //     password2
  //   });
  // } else {
  //   const existeUsuario = await Usuario.findOne({ email: email });

  //   if (existeUsuario) {
  //     req.flash("error_msg", "¡Correo ya registrado!");

  //     res.redirect("/registrarse");
  //   } else {
  //     const nuevoUser = new Usuario({ name, email, password });
  //     nuevoUser.password = await nuevoUser.encryptPassword(password);
  //     nuevoUser.token_verifica = randomString();
  //     nuevoUser.verificado = true;
      
  //     console.log(nuevoUser.token_verifica);
      
  //     nuevoUser.save(async (err, userDB) => {
  //       if (err) {
  //         req.flash("error_msg", `Errores: ${err}`);
  //         return res.redirect("/registrarse");
  //       }
        
  //       mails.enviarVerificacion(userDB._id, userDB.email, userDB.token_verifica)
  //       .then(result => {
  //           req.flash('exito_msg', `¡Te has registrado con éxito! te hemos enviado un correo de verificación a ${userDB.email} (Revisa tu carpeta de Spam) [ESTE SITIO ES DEMO, POR LO QUE SU CORREO YA ESTA VERIFICADO]`);
  //           console.log('Resultado positivo: ', result);

  //           return res.redirect('/ingresar');
  //       }).catch(err => {
  //           console.log('Resultado negativo: ', err);
  //           req.flash('error_msg', `¡Hubo un error al registrarse, intentelo de nuevo.`);
  //           return res.redirect('/registrarse');
  //       });
        
  //     });
  //   }
  // }
  // REGISTRO DESHABILITADO POR DEMO Desabilite la ruta anterior y comente el código de esta función.
   return res.redirect('/ingresar');
});

router.get('/ingresar', noAutenticado, (req, res) => {
    if(req.isAuthenticated()){
      return res.redirect('/user/perfil');
    }
    res.render('users/ingresar', { title: 'Ingresar'});
});

router.post('/ingresar', noAutenticado, passport.authenticate('local',{
    successRedirect: '/user/perfil',
    failureRedirect: '/ingresar',
    badRequestMessage: 'Ingrese sus credenciales',
    failureFlash: true
}));

router.get('/user/perfil', estaAutenticado, async (req, res) => {

  const filas = await Fila.find({usuario: req.user._id});

  res.render('users/perfil', { title: 'Perfil', num_filas: filas.length, filas});
});

router.get('/user/salir', (req, res) => {
    req.logOut();
    req.flash('exito_msg', 'Hasta la próxima! :)');
    res.redirect('/');
})

module.exports = router;
