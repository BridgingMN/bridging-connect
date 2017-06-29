// BASE MODULES
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// DATABASE MODULE
var database = require('./modules/database.js');

// AUTHENTICATION MODULES
var passport = require('./strategies/user_sql.js');
var session = require('express-session');
var isLoggedIn = require('./modules/authentication.js').isLoggedIn;
var isAdmin = require('./modules/authentication.js').isAdmin;

// ROUTE MODULES
var index = require('./routes/index.js');
var user = require('./routes/user.js');
var register = require('./routes/register.js');
var passwordreset = require('./routes/passwordreset.js');
var agencies = require('./routes/agencies.js');
var appointments = require('./routes/appointments.js').router;
var caseworkers = require('./routes/caseworkers.js');
var clients = require('./routes/clients.js').router;
var rules = require('./routes/rules.js');
var schedule = require('./routes/schedule.js');
var overrides = require('./routes/overrides.js');
var dataExport = require('./routes/dataExport.js');
var install = require('./routes/installDummies.js');

// TEST MODULES
var inserts = require('./modules/insertTestData.js').inserts;

// APP CONFIGURATION
app.set('port', (process.env.PORT || 5000));

// MIDDLEWARE CONFIGURATION
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './public')));

// PASSPORT SESSION CONFIGURATION
app.use(session({
   secret: process.env.SECRET || 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: {maxage: 60000, secure: false}
}));

// START PASSPORT SESSIONS
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use('/password', passwordreset);
app.use('/register', register);
app.use('/user', isLoggedIn, user);
app.use('/agencies', isAdmin, agencies);
app.use('/appointments', isLoggedIn, appointments);
app.use('/caseworkers', isAdmin, caseworkers);
app.use('/clients', isLoggedIn, clients);
app.use('/rules', isLoggedIn, rules);
app.use('/schedule', isAdmin, schedule);
app.use('/overrides', isAdmin, overrides);
app.use('/install', isAdmin, install);
app.use('/dataExport', isAdmin, dataExport);
app.use('/*', index);

// LISTEN
app.listen(app.get('port'), function(){
   console.log('listening on port:', app.get('port'));
});
