var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var usernameToLowerCase = require('../modules/authentication').usernameToLowerCase;

// Handles login form POST from index.html
router.post('/', usernameToLowerCase,
    passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/'
    })
);

// Handle index file separately
// Also catches any other request not explicitly matched elsewhere
router.get('/', function(req, res) {
  console.log('hit the index route');
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;
