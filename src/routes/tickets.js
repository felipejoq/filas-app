const router = require('express').Router();
const Fila = require('../models/Fila');
const { estaAutenticado, estaVerificado } = require('../middlewares/auth');

router.get('/user/fila/:id_fila/tomarticket', [estaAutenticado, estaVerificado], (req, res) => {

    Fila.findById({_id : req.params.id_fila}, (err, filaDB) => {
        if(err){
            req.flash('error_msg', 'Algo salió mal, vuelva a intentarlo.');
            return res.render('tickets/tomar-ticket');
        }
        res.render('tickets/tomar-ticket', { fila: filaDB });

    });

    
});

module.exports = router;