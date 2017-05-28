/**
 * Controller For caseworker-appointment-schedule
 * @module caseworker/schedule-appointment
 */
angular
  .module('myApp')
  .controller('AdminScheduleOverrideNewController', ['$location', 'CONSTANTS', 'ScheduleService', 'UserService', function($location, CONSTANTS,  ScheduleService, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this;
  vm.CONSTANTS = CONSTANTS;

  //Model for the currently selected date
  vm.selectedDate = new Date()
  vm.locations = [CONSTANTS.LOCATION_BLOOMINGTON, CONSTANTS.LOCATION_ROSEVILLE];
  vm.selectedLocation = vm.locations[0];

  var todaysDate = new Date();
  //Limits for the range of dates on the calendar
  vm.minDate = new Date(
    todaysDate.getFullYear(),
    todaysDate.getMonth(),
    todaysDate.getDate()
  );
  vm.maxDate = new Date(
    todaysDate.getFullYear(),
    todaysDate.getMonth() + 11,
    todaysDate.getDate()
  );

  //Model for the available appointment slots
  vm.appointmentSlots = [];

  //methods
  vm.selectDate = selectDate;

  activate();

  function activate() {
    console.log(vm);
  }

  /**
   * Called when the admin selects a date on the calendar input
   * this function should update the view to show appointment slots for that day
   * @function selectDate
   * @param {date} date The selected date.
   */
  function selectDate(date) {
    ScheduleService.getOverridesForDate(vm.selectedDate, vm.selectedLocation.location_name)
      .then(getOverridesSuccess, getOverridesFailure);
  }

  function getOverridesSuccess(response) {
    vm.appointmentSlots = response;
  }

  function getOverridesFailure(error) {
    console.error(error);
  }

  /**
   * This function should call a method from the Appointment object in the UserService
   * It reserves the selected appointment slot on the selected date
   * Then it redirects the caseworker to the Client Referral Form
   * @function reserveAppointment
   */

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
  function compareDates(appointmentDate, date) {
    //Convert date string from appointment object to a Javascript Date
    appointmentDate = new Date (appointmentDate);
    //Return a comparison of the two dates.
    return appointmentDate.getTime() == date.getTime();
  }
}]);
