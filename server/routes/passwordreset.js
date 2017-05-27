var express = require('express');
var router = express.Router();
var passport = require('passport');
var mail = require('../modules/mail.js');

//our modules
var tokens = require('../modules/tokens.js');
var formatters = require('../modules/formatters.js');
var formatDateForPostgres = formatters.formatDateForPostgres;


// module with bcrypt functions
var encryptLib = require('../modules/encryption');
var pool = require('../modules/database.js');

//Create a password reset token and set a new expiration date
//Then send a password reset link to the user's email
router.post('/forgotpassword', function (req, res) {
  console.log('forgotpassword route', req.body);

  var token = tokens.generateToken();
  var token_expiration = tokens.generateExpirationDate(4);
  var email = req.body.email;

  console.log('token, exp, email', token, token_expiration, email);

  pool.connect(function(err, database, done) {
    if (err) { // connection error
      console.log('error connecting to the database:', err);
      res.sendStatus(500);
    } else { // we connected
      database.query('UPDATE "users" ' +
                      'SET ("token", "token_expiration") = ' +
                      '($1, $2) ' +
                      'WHERE "email" = $3;',
                      [token, token_expiration, email],
        function(queryErr, result) { // query callback
          done(); // release connection to the pool
          if (queryErr) {
            console.log('error making query on /forgotpassword POST', queryErr);
            res.sendStatus(500);
          } else {
            console.log('successful update in "caseworkers"', result);
            mail.resetPassword(email, token);
            res.send({email: email});
          }
      }); // end query
    } // end if-else
  }); // end pool.connect
});

router.put('/resetpassword', function (req, res) {
  console.log('updatePassword route', req.body);
  var email = req.body.email;
  var password = encryptLib.encryptPassword(req.body.password);
  var token = req.body.code;
  var token_expiration = formatDateForPostgres(new Date());

  pool.connect(function(err, database, done) {
    if (err) { // connection error
      console.log('error connecting to the database:', err);
      res.sendStatus(500);
    } else { // we connected
      database.query('UPDATE "users" ' +
                      'SET ("password", "token_expiration") = ' +
                      '($1, $2) ' +
                      'WHERE "email" = $3 AND "token" = $4' +
                      ' AND "token_expiration" > $2;',
                      [password,  token_expiration, email, token ],
        function(queryErr, result) { // query callback
          done(); // release connection to the pool
          if (queryErr) {
            console.log('error making query on /password/resetpassword PUT', queryErr);
            res.sendStatus(500);
          } else {
            console.log('successful update in "caseworkers"', result);
            if (result.rowCount !== 0) {
              mail.updatedPassword(email, token);
              res.send({email: email});
            } else {
              res.sendStatus(500);
            }
          }
      }); // end query
    } // end if-else
  }); // end pool.connect
});

module.exports = router;
