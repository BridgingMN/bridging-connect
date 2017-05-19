// BASE MODULES
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//CONFIGURATION
var config = require('./modules/config.js');

// DATABASE MODULE
var database = require('./modules/database.js');

// AUTHENTICATION MODULES
var passport = require('./strategies/user_sql.js');
var session = require('express-session');

// ROUTE MODULES
var index = require('./routes/index.js');
var user = require('./routes/user.js');
var register = require('./routes/register.js');
var agencies = require('./routes/agencies.js');
var appointments = require('./routes/appointments.js');
var caseworkers = require('./routes/caseworkers.js');
var clients = require('./routes/clients.js');
var rules = require('./routes/rules.js');

// APP CONFIGURATION
app.set('port', (process.env.PORT || 5000));

// MIDDLEWARE CONFIGURATION
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './public')));

// PASSPORT SESSION CONFIGURATION
app.use(session({
   secret: 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: {maxage: 60000, secure: false}
}));

// START PASSPORT SESSIONS
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use('/register', register);
app.use('/user', user);
app.use('/agencies', agencies);
app.use('/appointments', appointments);
app.use('/caseworkers', caseworkers);
app.use('/clients', clients);
app.use('/rules', rules);
app.use('/*', index);

// LISTEN
app.listen(app.get('port'), function(){
   console.log('listening on port:', app.get('port'));
});
