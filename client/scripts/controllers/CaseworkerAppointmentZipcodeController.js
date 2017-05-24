angular
  .module('myApp')
  .controller('CaseworkerAppointmentZipcodeController', ['$location', 'AppointmentService', 'UserService', function($location, AppointmentService, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  //model for the zipcode input
  vm.zipCode = 55405;

  var todaysDate = new Date();
  //Limits for the range of dates on the calendar
  vm.minDate = new Date(
    todaysDate.getFullYear(),
    todaysDate.getMonth(),
    todaysDate.getDate() + 3
  );
  vm.maxDate = new Date(
    todaysDate.getFullYear(),
    todaysDate.getMonth() + 3,
    todaysDate.getDate()
  );
  vm.submitZipCode = submitZipCode;

  function submitZipCode(zip_code) {
    console.log(zip_code);
    console.log(UserService.newAppointment.submitZipCode);
    UserService.newAppointment.submitZipCode(zip_code)
      .then(zipCodeSuccess, zipCodeError);
  }

  function zipCodeSuccess(response) {
    console.log(response);
    var locationObject = response[0];
    UserService.newAppointment.location_name = locationObject.location;
    UserService.newAppointment.location_id =  locationObject.id;
    getAvailableAppointments(vm.minDate, vm.maxDate);
  }

  function zipCodeError(error) {
    console.log(error);
  }

  /**
   * Sends a request to the server to get available appointments.
   * @function getAvailableAppointments
   * @param {date} min_date Lowerbound of date range for query
   * @param {date} max_date Upperbound of date range for query
   */
  function getAvailableAppointments(min_date, max_date) {
    console.log('Getting Appointments', min_date, max_date);
    UserService.newAppointment.getAvailableAppointments(min_date, max_date)
      .then(availableAppointmentsSuccess, availableAppointmentsError);
  }

  /**
  * Called upon receiving an array of available Appointment objects
  * Updates the view to reflect available Appointments
  * Sets the currently selected Appointment to the first appointment in the array
  * @function availableAppointmentsSuccess
  * @param {array} response Array of Appointment objects
  */
  function availableAppointmentsSuccess(response) {
    AppointmentService.availableAppointments = response;
    console.log('vm.availableAppointments', AppointmentService.availableAppointments);
    $location.path('/caseworker-appointment-schedule');
  }

  /**
  * Handles error response from getAvailableAppointments
  * @function availableAppointmentsError
  * @param {object} error Error response.
  */
  function availableAppointmentsError(error) {
    console.error(error);
  }

}]);
