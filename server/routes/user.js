var express = require('express');
var router = express.Router();
var passport = require('passport');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
    // check if logged in
    console.log('checking /user route ');
    if(req.isAuthenticated()) {
        // send back user object from database
        var userObject = {
          access_disabled: req.user.access_disabled,
          agency_id: req.user.agency_id,
          city: req.user.city,
          day_phone: req.user.day_phone,
          department: req.user.department,
          email: req.user.email,
          ext: req.user.ext,
          first: req.user.first,
          last: req.user.last,
          state: req.user.state,
          street: req.user.street,
          user_type_id: req.user.user_type_id,
          zip_code: req.user.zip_code
        };
        res.send(userObject);
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
