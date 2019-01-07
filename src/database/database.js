const mongoose = require('mongoose');
require('../config/global');

mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(db => console.log('La base de datos está Online'))
  .catch(e => console.log('Hubo un error en la base de datos'));

module.exports = mongoose;