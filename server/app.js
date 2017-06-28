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
var isLoggedIn = require('./modules/authentication.js');

// ROUTE MODULES
var index = require('./routes/index.js');
var user = require('./routes/user.js');
var register = require('./routes/register.js');
var passwordreset = require('./routes/passwordreset.js');
var agencies = require('./routes/agencies.js');
var appointments = require('./routes/appointments.js');
var caseworkers = require('./routes/caseworkers.js');
var clients = require('./routes/clients.js');
var rules = require('./routes/rules.js');
var schedule = require('./routes/schedule.js');
var overrides = require('./routes/overrides.js');
var dataExport = require('./routes/dataExport.js');

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
app.use('/password', passwordreset);
app.use('/register', register);
app.use('/user', isLoggedIn, user);
app.use('/agencies', isLoggedIn, agencies);
app.use('/appointments', isLoggedIn, appointments);
app.use('/caseworkers', isLoggedIn, caseworkers);
app.use('/clients', isLoggedIn, clients);
app.use('/rules', isLoggedIn, rules);
app.use('/schedule', isLoggedIn, schedule);
app.use('/overrides', isLoggedIn, overrides);
app.use('/dataExport', isLoggedIn, dataExport);
app.use('/*', index);

// LISTEN
app.listen(app.get('port'), function(){
   console.log('listening on port:', app.get('port'));
});
