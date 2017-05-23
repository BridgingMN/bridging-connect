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
    if (!UserService.userObject.user.agency_access_disabled && !UserService.userObject.user.user_access_disabled) {
      UserService.newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_SHOPPING);
    }
  }

  function newBedAppointment() {
    if (!UserService.userObject.user.agency_access_disabled && !UserService.userObject.user.user_access_disabled) {
      UserService.newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_BED);
    }
  }

}]);
