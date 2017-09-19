/**
 * Controller For caseworker-appointment-schedule
 * @module caseworker/reschedule-appointment
 */
angular
  .module('myApp')
  .controller('CaseworkerAppointmentRescheduleController', ['$location', 'AppointmentService', 'UserService', function($location, AppointmentService, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this;
  vm.appointment = UserService.newAppointment;

  //Model for the currently selected date
  vm.selectedDate = new Date();

  //placeholder appointments
  vm.availableAppointments = AppointmentService.availableAppointments;

  //Limits for the range of dates on the calendar
  var todaysDate = new Date();
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
    selectDate(vm.availableAppointments[0].date);
  }

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
    var id = UserService.newAppointment.id;
    console.log('UserService.newAppointment', UserService.newAppointment);
    console.log('in controller reserveAppointment, logging vm.selectedAppointment', vm.selectedAppointment);
    UserService.newAppointment.submitAppointment(vm.selectedAppointment);
    UserService.newAppointment.reserveAppointment()
    .then(
      function (reserveResponse) {
        console.log('Reserve Appointment Success Response', reserveResponse);
        console.log('id', id);
        AppointmentService.cancelAppointment(id)
        .then(
          function (cancelResponse) {
            console.log('Cancel Old Appointment Success Response', cancelResponse);
            $location.path('/caseworker-appointments-all');
          },
          function (cancelError) {
            console.log('Cancel Error Response', cancelError);
          }
        );
      },
      function (reserveError) {
        console.log('Reserve Error', reserveError);
      }
    );
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
  function compareDates(appointmentDate, date) {
    //Convert date string from appointment object to a Javascript Date
    appointmentDate = new Date (appointmentDate);
    //Return a comparison of the two dates.
    var match = appointmentDate.toISOString().substr(0,10) === date.toISOString().substr(0,10);
    return (match);
  }
}]);
