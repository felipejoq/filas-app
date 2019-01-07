const router = require("express").Router();
const Usuario = require("../models/User");
const mails = require('../helpers/mails/verifica-cuenta');
const { estaAutenticado, noVerificado} = require('../middlewares/auth');

router.get("/verifica/:id/:token_v", async(req, res) => {
  console.log("Solicitó verificar cuenta...");

  const id = req.params.id;
  const token_v = req.params.token_v;

  console.log('Id: '+ id + ' token: ' + token_v);

  let cambiaVerificado = {
    verificado: true
  };

  Usuario.findOneAndUpdate({$and:[{_id: id}, {token_verifica: token_v}]}, cambiaVerificado, { new: true }, (err, userUpdated) => {
    if(err){
      req.flash('error_msg', 'Hubo un error al verificar, intente de nuevo.');
    }
    if(!userUpdated){
      req.flash('error_msg', 'Hubo un error al buscar el usuario, intente de nuevo.');
    }

    req.flash('exito_msg', 'Su cuenta ha sido verificada con éxito!');
    res.redirect('/ingresar');
    
  });

});

router.get('/verifica/again',[estaAutenticado, noVerificado], async(req, res) => {
    mails.enviarVerificacion(req.user._id, req.user.email, req.user.token_verifica)
    .then(resp => {
      req.flash('exito_msg', 'El correo de verificación fue reenviado.');
      res.redirect('/user/perfil');
    })
    .catch(err => {
      req.flash('error_msg', 'Hubo un error en el reenvío del correo, intentelo de nuevo más tarde.');
      res.redirect('/user/perfil');
    });
});

module.exports = router;
