angular
  .module('myApp')
  .controller('UserController', ['$location', 'CONSTANTS','AppointmentService', 'UserService', function($location, CONSTANTS, AppointmentService, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.CONSTANTS = CONSTANTS;
  vm.userObject = UserService.userObject;

  // DATA-BINDING FUNCTIONS
  vm.logout = UserService.logout;
  vm.newShoppingAppointment = newShoppingAppointment;
  vm.newBedAppointment = newBedAppointment;

  function newShoppingAppointment() {
    UserService.newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_SHOPPING);
  }

  function newBedAppointment() {
    UserService.newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_BED);
  }
}]);
