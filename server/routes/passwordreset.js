var express = require('express');
var router = express.Router();
var passport = require('passport');

// module with bcrypt functions
var encryptLib = require('../modules/encryption');
var pool = require('../modules/database.js');

var Chance = require('chance');
var chance = new Chance();


//Create a password reset token and set a new expiration date
//Then send a password reset link to the user's email
router.post('/forgotpassword', function (req, res) {
  console.log('forgotpassword route', req.body);

  var token = chance.string({pool: 'abcdefghijklmnopqrstuvwxyz1234567890', length:20});
  var token_expiration = new Date();
  token_expiration.setDate(token_expiration.getDate()+1);
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
            console.log('error making query on /caseworkers/:caseworker_id PUT', queryErr);
            res.sendStatus(500);
          } else {
            console.log('successful update in "caseworkers"', result);
            res.send({email: email});
          }
      }); // end query
    } // end if-else
  }); // end pool.connect

});

module.exports = router;
