const router = require('express').Router();
const Fila = require('../models/Fila');

router.get('/user/fila/:id_fila/tablero', (req, res) => {

    Fila.findOne({_id: req.params.id_fila}).populate('ultimos4').exec((err, filaDB) => {

        if(err){
            req.flash('error_msg', 'Hubo un error al cargar el tablero, intente de nuevo.');
            return res.redirect('/');
        }
        return res.render('tablero/tablero', {fila: filaDB, title: 'Fila ' + filaDB.name });
    });
});

module.exports = router;