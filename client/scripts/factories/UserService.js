angular
  .module('myApp')
  .factory('UserService', ['$http', '$location', 'CONSTANTS', 'AppointmentService', function($http, $location, CONSTANTS, AppointmentService){
  var userObject = {

  };


  var agencies = {};
  var newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_SHOPPING);

  function getAvailAppts(paramsObj) {
    $http({
      url: '/appointments/available',
      method: 'GET',
      params: paramsObj
    }).then(function(response) {
      console.log(response);
    });
  }

  var paramsObj = {
    min_date: new Date('May 24, 2017'),
    max_date: new Date('June 20, 2017'),
    appointment_type: 'shopping',
    delivery_method: 'delivery',
    location_id: 1
  };

  getAvailAppts(paramsObj);

  return {
    userObject: userObject,
    newAppointment: newAppointment,
    agencies: agencies,
    getAgencies: getAgencies,
    loginUser: loginUser,
    registerUser: registerUser,
    getUser: getUser,
    logout: logout,
    redirectToLogin: redirectToLogin,
    redirectToAdminAppointmentsAll: redirectToAdminAppointmentsAll,
    redirectToCaseworkerAppointmentsAll: redirectToCaseworkerAppointmentsAll
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

  //GETS all agencies from db
  function getAgencies() {
    console.log('client sent request to server for all agencies');
    $http.get('/agencies').then(function(response) {
        agencies.array = response.data;
        console.log(agencies.array);
    });
  }
}]);
