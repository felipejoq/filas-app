const cron = require('node-cron');
const mongoose = require('mongoose');
const Usuario = require('../models/User');
require('../config/global');

cron.schedule('0 0 * * *', () => {
    mongoose.connect(process.env.DB_URL,{
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }, async() => {
        mongoose.connection.db.dropCollection('usuarios', function(err, result) {});
        mongoose.connection.db.dropCollection('escritorios', function(err, result) {});
        mongoose.connection.db.dropCollection('tickets', function(err, result) {});
        mongoose.connection.db.dropCollection('filas', function(err, result) {});
        
        //mongoose.connection.db.createCollection('usuarios');

        const userAdmin = new Usuario ({
            name: 'Admin Filas App',
            email: 'admin@filasapp.com',
            verificado: true
        });

        userAdmin.password = await userAdmin.encryptPassword('123123');
        userAdmin.token_verifica = await userAdmin.genTokenVerifica();

        console.log('DB eliminada.');

        await userAdmin.save((err, userSaved) => {
            console.log('¿Errores? ', err);
            console.log('Usuario creado: ', userSaved);
        });

    });
  }, {
    scheduled: true,
    timezone: "America/Santiago"
  });

module.exports = cron;