const router = require('express').Router();
const Fila = require('../models/Fila');
const Escritorio = require('../models/Escritorio');
const { estaAutenticado, estaVerificado, lePertenece} = require('../middlewares/auth');

router.get('/escritorios/:fila', [estaAutenticado, estaVerificado, lePertenece], (req, res) => {
    Fila.findById(req.params.fila).populate('escritorios').exec((err, filaDB) => {

        if(err){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back');
        }
        if(!filaDB){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back');
        }
        res.render('escritorios/escritorios-list', { escritorios: filaDB.escritorios, fila_id: filaDB._id, nombre_fila: filaDB.name });

    });

});

router.get('/escritorios/add/:fila_id', [estaAutenticado, estaVerificado, lePertenece ], async (req, res) => {

    const fila = await Fila.findById(req.params.fila_id);

    if(!fila){
        req.flash('error_msg', 'Hubo un error al agregar el escritorio. Intentelo de nuevo por favor.');
        return res.redirect('back');
    }

    res.render('escritorios/escritorio-add', {name_fila: fila.name, id_fila: fila._id});
});

router.post('/escritorios/add/:fila_id', [estaAutenticado, estaVerificado, lePertenece], (req, res) => {
    const { number, description } = req.body;
    const id_fila = req.params.fila_id;

    Fila.findById(id_fila, (err, filaDB) => {

        if(err){
            req.flash('error_msg', 'Hubo un error al guardar el escritorio.');
            return res.redirect('back');
        }

        if(!filaDB){
            req.flash('error_msg', 'Ocurrió un error, intente de nuevo.');
            return res.redirect('back');
        }

        const nuevoEscritorio = new Escritorio({
            number: number,
            description: description,
            fila: id_fila
        });

        nuevoEscritorio.save((err, escritorioDB) => {
            if(err){
                req.flash('error_msg', 'Hubo un error al guardar el escritorio.');
                return res.redirect('back');
            }

            filaDB.escritorios.push(escritorioDB);

            filaDB.save();

            req.flash('exito_msg', 'El escritorio fue agregado a la fila');
            return res.redirect('/escritorios/'+filaDB._id);
        });


    });

});

router.get('/escritorios/delete/:id',[estaAutenticado, estaVerificado, lePertenece], async(req, res) => {
    Escritorio.findOneAndDelete({_id : req.params.id}, (err, escritorioDel) => {
        if(err){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back')
        }
        if(!escritorioDel){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back');
        }
        
        Fila.findOne({_id : escritorioDel.fila}, (err, filaUpdate) => {
            for (let i = 0; i < filaUpdate.escritorios.length; i++) {
                if(filaUpdate.escritorios[i] = escritorioDel._id){
                    filaUpdate.escritorios.splice(i, 1);
                    filaUpdate.save();
                    break;
                }
            }
        });
        
        req.flash('exito_msg', 'El escritorio fue eliminado.');
        res.redirect('back');
    })
});

router.get('/escritorios/edit/:id',[estaAutenticado, estaVerificado, lePertenece], (req, res) => {
    Escritorio.findOne({_id: req.params.id}, (err, escritorioDB) => {
        if(err){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back')
        }
        if(!escritorioDB){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back');
        }

        Fila.findOne({_id: escritorioDB.fila}, (err, filaDB) => {


            if(err){
                req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
                return res.redirect('back')
            }
            if(!filaDB){
                req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
                return res.redirect('back');
            }

            res.render('escritorios/escritorio-edit', {escritorio: escritorioDB, fila: filaDB});
        })

        
    });
});

router.post('/escritorios/edit/:id',[estaAutenticado, estaVerificado, lePertenece], (req, res) => {

    escritorioEdit = {
        number: req.body.number,
        description: req.body.description
    }

    Escritorio.findOneAndUpdate({_id: req.params.id},escritorioEdit, {new: true}, (err, escritorioEdit) => {
        if(err){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back')
        }
        if(!escritorioEdit){
            req.flash('error_msg', 'Algo salió mal, intentelo de nuevo.');
            return res.redirect('back');
        }

        req.flash('exito_msg', 'El escritorio fue editado con éxito.');
        res.redirect('/escritorios/'+escritorioEdit.fila);
    });

    
});

module.exports = router;