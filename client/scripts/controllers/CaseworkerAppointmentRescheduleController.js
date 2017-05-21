/**
 * Controller For caseworker-appointment-schedule
 * @module caseworker/reschedule-appointment
 */
angular
  .module('myApp')
  .controller('CaseworkerAppointmentRescheduleController', ['$location', 'UserService', function($location, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this;
  vm.appointment = UserService.newAppointment;

  //Model for the currently selected date
  vm.selectedDate = new Date();

  //placeholder appointments
  vm.availableAppointments = [{
    date: new Date(
      vm.selectedDate.getFullYear(),
      vm.selectedDate.getMonth(),
      vm.selectedDate.getDate() + 4),
    appointment_slot_id: 1,
    start_time: '9:15 AM'
  },{
    date: new Date(
      vm.selectedDate.getFullYear(),
      vm.selectedDate.getMonth(),
      vm.selectedDate.getDate() + 4)
  },
  {
    date: new Date(
      vm.selectedDate.getFullYear(),
      vm.selectedDate.getMonth(),
      vm.selectedDate.getDate() + 5)
  }];

  //Limits for the range of dates on the calendar
  vm.minDate = new Date(
    vm.selectedDate.getFullYear(),
    vm.selectedDate.getMonth(),
    vm.selectedDate.getDate() + 3
  );
  vm.maxDate = new Date(
    vm.selectedDate.getFullYear(),
    vm.selectedDate.getMonth() + 1,
    vm.selectedDate.getDate()
  );

  //Model for the available appointment slots
  vm.appointmentSlots = [];

  //Model for the selected appointment slot
  vm.selectedAppointment = vm.appointmentSlots[0];

  //methods
  vm.availableAppointmentsPredicate = availableAppointmentsPredicate;
  vm.selectDate = selectDate;
  vm.reserveAppointment = reserveAppointment;

  // getAvailableAppointments(vm.minDate, vm.maxDate);

  function availableAppointmentsPredicate (date) {
    return vm.availableAppointments.some(filterAppointmentsByDate, date);
  }

  /**
   * Called when the caseworker selects a date on the calendar input
   * this function should update the view to show available appointments for that day
   * @function selectDate
   * @param {date} date The selected date.
   */
  function selectDate(date) {
    console.log(date);
    vm.selectedDate = date;
    vm.appointmentSlots = vm.availableAppointments.filter(filterAppointmentsByDate, date);
    vm.selectedAppointment = vm.appointmentSlots[0];
  }

  /**
   * This function should call a method from the Appointment object in the UserService
   * It reserves the selected appointment slot on the selected date
   * Then it redirects the caseworker to the Client Referral Form
   * @function reserveAppointment
   */
  function reserveAppointment() {
    console.log(vm.selectedAppointment);
    UserService.newAppointment.submitAppointment(vm.selectedAppointment);
    $location.path('/caseworker-appointment-form');
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
    vm.availableAppointments = response;
    selectDate(vm.availableAppointments[0].date);
  }

  /**
  * Handles error response from getAvailableAppointments
  * @function availableAppointmentsError
  * @param {object} error Error response.
  */
  function availableAppointmentsError(error) {
    console.error(error);
  }

  /**
  * Filter appointments by date
  * @function filterAppointmentsByDate
  * @param {object} appointment Appointment to be filtered
  * @this This is the date to use as a filter.
  */
  function filterAppointmentsByDate(appointment) {
    var date = this;
    return compareDates(appointment.date, date);
  }

  /**
   * Compare two calendar dates and return true if they are equal
   * @function compareDates
   * @param {date} date1 First date
   * @param {date} date2 Second date
   * @returns {boolean} True if the dates are the same, otherwise false
   */
  function compareDates(date1, date2) {
    date1 = moment(date1).format('YYYY-MM-DD');
    date2 = moment(date2).format('YYYY-MM-DD');
    return moment(date1).isSame(date2);
  }


}]);
