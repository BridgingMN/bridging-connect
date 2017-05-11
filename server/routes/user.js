var express = require('express');
var router = express.Router();
var passport = require('passport');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
    // check if logged in
    //---console.log('checking /user route ');
    if(req.isAuthenticated()) {
        // send back user object from database
        console.log(req.user);
        res.send(req.user);
    } else {
        // failure best handled on the server. do redirect here.
        res.send(false);
    }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  //---console.log('user logged out');
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
