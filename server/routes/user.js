var express = require('express');
var router = express.Router();
var passport = require('passport');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
    // check if logged in
    if(req.isAuthenticated()) {
        // send back user object from database
        var userObject = {
          user_id: req.user.user_id,
          user_type_id: req.user.user_type_id,
          first: req.user.first,
          last: req.user.last,
          email: req.user.email,
          day_phone: req.user.day_phone,
          ext: req.user.ext,
          department: req.user.department,
          user_access_disabled: req.user.user_access_disabled,
          agency_access_disabled: req.user.agency_access_disabled,
          agency_id: req.user.agency_id,
          bridging_agency_id: req.user.bridging_agency_id,
          agency_name: req.user.name,
          primary_first: req.user.primary_first,
          primary_last: req.user.primary_last,
          primary_business_phone: req.user.primary_business_phone,
          primary_business_phone_ext: req.user.primary_business_phone_ext,
          primary_mobile_phone: req.user.primary_mobile_phone,
          primary_email: req.user.primary_email,
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
