angular
  .module('myApp')
  .factory('UserService', ['$http', '$location', 'CONSTANTS', 'AppointmentService', function($http, $location, CONSTANTS, AppointmentService){

  var userObject = {};

  var agencies = {};
  var agency = {};
  var newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_SHOPPING);

  return {
    userObject: userObject,
    newAppointment: newAppointment,
    agencies: agencies,
    agency: agency,
    getAgencies: getAgencies,
    viewAgency: viewAgency,
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
        redirectToLogin();
      } else {
        userObject.user = response.data;
      }
      console.log(userObject);
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
    userObject.user = {};
    userObject.newAppointment = {};
    userObject.agencies = {};
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

  //Views details of single selected agency
  function viewAgency(agency_id) {
    console.log('view details clicked ', agency_id);
    var id = agency_id.id;
    console.log('agency id: ', id);
    $http.get('/agencies/' + id).then(function(response) {
      agency.selected = response.data;
      console.log('Agency record back from db: ', agency.selected);
    });
  }
}]);
