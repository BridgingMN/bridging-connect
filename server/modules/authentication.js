// CONSTANTS
var ADMIN_ID = 1; // id of admin user type in user_types table in DB

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    return res.redirect('/');
}

// route middleware to make sure a user is an administrator
function isAdmin(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    if (req.user.user_type_id === ADMIN_ID) {
      return next();
    }
  }
  // if they aren't redirect them to the home page
  return res.redirect('/');
}

//username is not case sensitive
function usernameToLowerCase(req, res, next){
         req.body.email = req.body.email.toLowerCase();
         next();
     }

module.exports = {
  isLoggedIn: isLoggedIn,
  isAdmin: isAdmin,
  usernameToLowerCase: usernameToLowerCase
};
