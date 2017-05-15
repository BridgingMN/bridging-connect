angular
  .module('myApp')
  .factory('UserService', ['$http', '$location', function($http, $location){
  var userObject = {

  };

  //--------AUTHENTICATION--------
  // login an existing user
  function loginUser(tempUser) {
    return $http.post('/', tempUser).then(function(response) {
      if (response.data.username) { // login successful
        return response.data.type;
 // ^^^ return response.data.____; ^^^
 // ^^^ WHATEVER WE'RE CALLING USER "type" in the DB ^^^
      } else { // failed login
        return false;
      }
    });
  } // end login()

  // register a new user
  function registerUser(tempUser) {
    return $http.post('/register', tempUser);
  } // end registerUser()

  // verify user authentication
  function getUser() {
    $http.get('/user').then(function(response) {
      if (!response.data.username) {
        // redirectToLogin();
      }
    });
  } // end getUser()

  // logout the user
  function logout() {
    $http.get('/user/logout').then(function(response) {
      clearCurrentUser(); // clear userObject data
      redirectToLogin();
    });
  } // end logout()
  //--------END AUTHENTICATION--------

  //----------REDIRECTS--------------
  function redirectToLogin() {
    $location.path('/login');
  }

  function redirectToAdminAppointmentsPending() {
    $location.path('/admin-appointments-pending');
  }

  function redirectToCaseworkerAppointmentsAll() {
    $location.path('/caseworker-appointments-all');
  }

  //---------END REDIRECTS-----------

  //---------SUPPORT FUNCTIONS-------
  function clearCurrentUser() {
    // clear out the userObject's properties on logout
    // for example purposes:
    // userObject.firstName = '';
    // userObject.lastName = '';
    // appointmentsArray = [];
  }
  //------END SUPPORT FUNCTIONS-----

  return {
    userObject: userObject,
    loginUser: loginUser,
    registerUser: registerUser,
    getUser: getUser,
    logout: logout,
    redirectToLogin: redirectToLogin,
    redirectToAdminAppointmentsPending: redirectToAdminAppointmentsPending,
    redirectToCaseworkerAppointmentsAll: redirectToCaseworkerAppointmentsAll
  };
}]);
