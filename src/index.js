const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const bodyParser  = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const http = require('http');

// Inicializaciones
const app = express();
let server = http.createServer(app);
require('./database/database');
require('./config/passport');
require('./config/global');

// Configuraciones
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./helpers/helpers'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'bZdhL4ZUcAWYUJRcKXqdHTAn',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//Cron 
require('./config/cron');

// Variables globales
app.use((req, res, next) =>{

    app.locals.exito_msg = req.flash('exito_msg');
    app.locals.error_msg = req.flash('error_msg');
    app.locals.user = req.user;
    app.locals.error = req.flash('error');

    next();
});

// Rutas
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/filas'));
app.use(require('./routes/escritorios'));
app.use(require('./routes/tickets'));
app.use(require('./routes/tableros'));
app.use(require('./routes/atender'));
app.use(require('./routes/verificacion'));

// Path público
app.use(express.static(path.join(__dirname, 'public')));

// Socket
module.exports.io = socketIO(server);
require('./sockets/socket.tickets-fila');

//404 Error
app.get('*', (req, res) => {
    res.render('404', { title: '404 - Esta página no existe :(', url: req.url });
});

// Inicia Servidor
server.listen(app.get('port'), (err) => {
    console.log('Servidor trabajando en http://localhost:' + app.get('port'));
});