/**
 * Controller For caseworker-appointments-all
 * The caseworker homepage
 * @module caseworker/appointments-all
 */

angular
  .module('myApp')
  .controller('CaseworkerAppointmentsAllController', ['$location', '$mdToast', '$mdDialog', 'AppointmentService', 'CONSTANTS', 'UserService', function($location, $mdToast, $mdDialog, AppointmentService, constants, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  // Binds user data from factory
  vm.user = UserService.userObject;
  vm.CONSTANTS = constants;


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

  // Stores current appointment filter, by default should show all appointments
  vm.appointmentFilter = '';

  // Methods
  vm.getUserAppointments = getUserAppointments;
  vm.setAppointmentFilter = setAppointmentFilter;
  vm.rescheduleAppointment = rescheduleAppointment;
  vm.editAppointmentInfo = editAppointmentInfo;
  vm.confirmCancelAppointment = confirmCancelAppointment;
  vm.showAppointmentDetails = showAppointmentDetails;
  vm.createNewAppointment = createNewAppointment;


  //This is a placeholder, in production appointsments will be an array property on the user object.
  vm.caseworkerAppointments = [];

  //Setup models
  activate();

  /**
   * Run once upon loading controller, sets up models and other variables used by controller.
   * @function activate
   */
  function activate() {
    getUserAppointments();
    console.log('caseworker appts', vm.caseworkerAppointments);
  }


  /**
   * Calls a method of the AppointmentService to GET extant appointment for this caseworker.
   * @function getUserAppointments
   */
  function getUserAppointments() {
    AppointmentService.getUserAppointments().then(
      getAppointmentsSuccess, getAppointmentsError
    );
  }

  function getAppointmentsSuccess(appointments) {
    vm.caseworkerAppointments = appointments;
  }

  function getAppointmentsError(error) {
    console.log(error);
  }

  function setAppointmentFilter(filter) {
    console.log(filter);
    vm.appointmentFilter = filter;
  }

  //This function will redirect the caseworker to a view where they can reschedule their appointment
  function rescheduleAppointment(appointment) {
    console.log('Rescheduling', appointment);
    UserService.newAppointment = new AppointmentService.Appointment(appointment.info.appointment_type);
    UserService.newAppointment.appointment.date = new Date(appointment.info.appointment_date);
    UserService.newAppointment.appointment.start_time = appointment.info.start_time;
    UserService.newAppointment.client_id = appointment.client.client_id;
    UserService.newAppointment.delivery_method = appointment.info.delivery_method;
    UserService.newAppointment.location_id = appointment.info.location_id;
    UserService.newAppointment.location_name = appointment.info.location_name;
    getAvailableAppointments(vm.minDate, vm.maxDate);
  }

  //This function will redirect the caseworker to a view where they can edit the referall form for their client
  function editAppointmentInfo(appointment) {
    console.log(appointment);
    UserService.userObject.client_id = appointment.client.client_id;
    $location.path('/caseworker-appointment-edit-form');
  }

  function confirmCancelAppointment(appointment) {
    var confirm = $mdDialog.confirm()
      .title('Cancel Appointment')
      .textContent('Are you sure you want to cancel this ' + appointment.info.appointment_type +
                    ' appointment for your client ' + appointment.client.first + ' ' +
                     appointment.client.last + ' on ' + moment(appointment.info.date).format('dddd, MMMM Do, YYYY') + '?')
      .ariaLabel('Cancel Appointment')
      .ok('Yes, cancel the appointment')
      .cancel('No, do not cancel the appointment');

    $mdDialog.show(confirm)
      .then(function () {
        cancelAppointment(appointment);
      });
  }

  function cancelAppointment(appointment) {
    AppointmentService.cancelAppointment(appointment.id)
    .then(cancelAppointmentSuccess, showToastError);
  }

  function cancelAppointmentSuccess(response) {
    getUserAppointments();
    showToastSuccess(response);
  }

  function showToastSuccess (text) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .hideDelay(3000)
    );
  }

  function showToastError (text) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .hideDelay(3000)
    );
  }

  function showAppointmentDetails(appointment_id) {
    console.log(appointment_id);
    //This function would show the details for a particular appointment.
  }

  function createNewAppointment() {
    console.log('Resetting Appointment object');
    //This function should call a method in the service that resets the newAppointment object and redirects the caseworker to the new appointment view
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
    $location.path('/caseworker-appointment-reschedule');
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
