/**
 * Controller For caseworker-appointment-schedule
 * @module caseworker/schedule-appointment
 */
angular
  .module('myApp')
  .controller('CaseworkerAppointmentScheduleController', ['$location', '$scope', 'CONSTANTS', 'AppointmentService', 'UserService', function($location, $scope, CONSTANTS,  AppointmentService, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this;
  console.log('UserService.appointment assigned to vm.appointment', UserService.newAppointment);
  vm.appointment = UserService.newAppointment;
  vm.CONSTANTS = CONSTANTS;

  //Model for the currently selected date
  vm.selectedDate = new Date();

  //placeholder appointments
  vm.availableAppointments = AppointmentService.availableAppointments;

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

  //Model for the available appointment slots
  vm.appointmentSlots = [];

  //Model for the selected appointment slot
  vm.selectedAppointment = vm.appointmentSlots[0];

  //methods
  vm.availableAppointmentsPredicate = availableAppointmentsPredicate;
  vm.selectDate = selectDate;
  vm.reserveAppointment = reserveAppointment;

  activate();

  function activate() {
    console.log('UserService at activate', UserService);
    selectDate(vm.availableAppointments[0].date);
  }

  function availableAppointmentsPredicate (date) {
    console.log('Selected date', date, typeof date);
    console.log(vm.availableAppointments.some(filterAppointmentsByDate, date));
    return vm.availableAppointments.some(filterAppointmentsByDate, date);
  }

  /**
   * Called when the caseworker selects a date on the calendar input
   * this function should update the view to show available appointments for that day
   * @function selectDate
   * @param {date} date The selected date.
   */
  function selectDate(date) {
    vm.selectedDate = new Date(date);
    vm.appointmentSlots = vm.availableAppointments.filter(filterAppointmentsByDate, vm.selectedDate);
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
  * Filter appointments by date
  * @function filterAppointmentsByDate
  * @param {object} appointment Appointment to be filtered
  * @this This is the date to use as a filter.
  */
  function filterAppointmentsByDate(appointment) {
    var date = this;
    console.log(appointment.date, date);
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
    // console.log(appointmentDate.getTime(), date.getTime());
    // console.log(typeof appointmentDate.getTime(),typeof date.getTime());
    return appointmentDate.getTime() == date.getTime();
  }
}]);
