angular
  .module('myApp')
  .factory('UserService', ['$http', '$location', function($http, $location){
  var userObject = {

  };

  //--------AUTHENTICATION--------
  // login an existing user
  function loginUser(tempUser) {
    return $http.post('/', tempUser).then(function(response) {
      console.log(response);
      if (response.data.email) { // login successful
        console.log(response.data.user_type_id);
        return response.data.user_type_id;
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
      if (!response.data.email) {
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

  function redirectToAdminAppointmentsAll() {
    $location.path('/admin-appointments-all');
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

  function postAgency(object) {
    console.log('hi');
    $http.post('/agencies', object).then(function(response) {
      console.log(response);
    });
  }

  var agencyObject = {
    name : 'Fake Agency',
    bridging_agency_id: 9939,
    primary_first: 'Lumpy',
    primary_last: 'Robertson',
    primary_job_title: 'Honcho',
    primary_department: 'Bricks',
    primary_business_phone: '555.6666',
    primary_business_phone_ext: '32',
    primary_mobile_phone: '444.555',
    primary_email: 'lumpy@lumps.com',
    beds_allowed_option: 'yes',
    access_disabled: false
  };

  postAgency(agencyObject);

  return {
    userObject: userObject,
    loginUser: loginUser,
    registerUser: registerUser,
    getUser: getUser,
    logout: logout,
    redirectToLogin: redirectToLogin,
    redirectToAdminAppointmentsAll: redirectToAdminAppointmentsAll,
    redirectToCaseworkerAppointmentsAll: redirectToCaseworkerAppointmentsAll
  };
}]);
