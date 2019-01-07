const fila = {};
const Fila = require('../models/Fila');

fila.puedeCrear = async (req, res, next) => {

    const tieneFilas = await Fila.find({usuario: req.user._id});

    if(req.user.role === 'Usuario' && tieneFilas.length < 1){
        console.log('El usuario no tiene filas, o sea que puede crear una.');
        return next();
    }

    req.flash('error_msg', 'Usted sólo puede crear una fila porque es un usuario no administrador.');
    res.redirect('/user/filas');
}

module.exports = fila;