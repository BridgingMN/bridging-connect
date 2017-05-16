var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var pool = require('../modules/database.js');
//@TODO update pool config for Heroku deployment

var acquireCount = 0;
pool.on('acquire', function (client) {
  acquireCount++;
  //---console.log('client acquired - acquireCount: ', acquireCount);
});

var connectCount = 0;
pool.on('connect', function () {
  connectCount++;
  //---console.log('client connected - connectCount: ', connectCount);
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //---console.log('called deserializeUser - pg');

  pool.connect(function (err, client, release) {
    if(err) {
      //---console.log('connection err ', err);
      release();
      done(err);
    }

    var user = {};

    client.query("SELECT * FROM users WHERE id = $1", [id], function(err, result) {

      // Handle Errors
      if(err) {
        //---console.log('query err ', err);
        done(err);
        release();
      }

      user = result.rows[0];
      release();

      if(!user) {
          // user not found
          return done(null, false, {message: 'Incorrect credentials.'});
      } else {
        // user found
        //---console.log('User row ', user);
        done(null, user);
      }

    });
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, function(req, email, password, done) {
	    pool.connect(function (err, client, release) {
	    	// console.log('called local - pg');

        // assumes the email will be unique, thus returning 1 or 0 results
        client.query("SELECT * FROM users WHERE email = $1", [email],
          function(err, result) {
            var user = {};

            console.log('here');

            // Handle Errors
            if (err) {
              console.log('connection err ', err);
              done(null, user);
            }

            release();
            //---console.log(connectCount);

            if(result.rows[0] !== undefined) {
              user = result.rows[0];
              console.log('User obj', user);
              console.log(user.password);
              // Hash and compare
              if(encryptLib.comparePassword(password, user.password)) {
                // all good!
                console.log('passwords match');
                done(null, user);
              } else {
                console.log('password does not match');
                done(null, false, {message: 'Incorrect credentials.'});
              }
            } else {
              console.log('no user');
              done(null, false);
            }

          });
	    });
    }
));

module.exports = passport;
