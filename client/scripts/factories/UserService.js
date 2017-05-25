angular
  .module('myApp')
  .factory('UserService', ['$http', '$location', 'CONSTANTS', 'AppointmentService', function($http, $location, CONSTANTS, AppointmentService){

  var userObject = {};

  var agencies = {};
  var agency = {};
  var caseworker = {};
  var locations = {};
  var days = {};
  var types = {};
  var methods = {};
  var selected = [];
  var query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  var newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_SHOPPING);

  return {
    userObject: userObject,
    newAppointment: newAppointment,
    selected: selected,
    query: query,
    locations: locations,
    days: days,
    types: types,
    methods: methods,
    agencies: agencies,
    agency: agency,
    getAgencies: getAgencies,
    caseworker: caseworker,
    viewCaseworker: viewCaseworker,
    viewAgency: viewAgency,
    getLocations: getLocations,
    getDays: getDays,
    getTypes: getTypes,
    getMethods: getMethods,
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
  //Views details of single selected caseworker
  function viewCaseworker(caseworker_id) {
    console.log('view details clicked ', caseworker_id);
    $http.get('/caseworkers/' + caseworker_id).then(function(response) {
      caseworker.selected = response.data;
      console.log('Caseworker record back from db: ', caseworker.selected);
    });
  }

  //GETS all warehouse locations from db
  function getLocations() {
    console.log('client sent request to server for all locations');
    $http.get('/schedule/locations').then(function(response) {
        locations.array = response.data;
        console.log('locations: ', locations.array);
    });
  }

  //GETS all days of the week from db
  function getDays() {
    console.log('client sent request to server for all days');
    $http.get('/schedule/days').then(function(response) {
        days.array = response.data;
        console.log('days: ', days.array);
    });
  }

  //GETS all appointment types from db
  function getTypes() {
    console.log('client sent request to server for all appointment types');
    $http.get('/schedule/types').then(function(response) {
        types.array = response.data;
        console.log('types: ', types.array);
    });
  }

  //GETS all delivery methods from db
  function getMethods() {
    console.log('client sent request to server for all delivery methods');
    $http.get('/schedule/deliverymethods').then(function(response) {
        methods.array = response.data;
        console.log('methods: ', methods.array);
    });
  }

}]);
