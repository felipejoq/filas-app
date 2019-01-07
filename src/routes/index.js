const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'Portada'});
});

router.get('/about', (req, res) => {
    res.render('about', { title: '¿Qué es Filas app?'});
});

module.exports = router;