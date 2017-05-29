angular
  .module('myApp')
  .controller('UserController', ['$location', 'CONSTANTS','AppointmentService', 'UserService', function($location, CONSTANTS, AppointmentService, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.CONSTANTS = CONSTANTS;
  vm.userObject = UserService.userObject;
  console.log('Header userObject', vm.userObject);

  // DATA-BINDING FUNCTIONS
  vm.logout = UserService.logout;
  vm.newShoppingAppointment = newShoppingAppointment;
  vm.newBedAppointment = newBedAppointment;

  vm.navBar = UserService.navBar;

  function newShoppingAppointment() {
    if (!UserService.userObject.user.agency_access_disabled && !UserService.userObject.user.user_access_disabled) {
      console.log('newAppointment being created');
      UserService.newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_SHOPPING);
      console.log(UserService.newAppointment);
    }
  }

  function newBedAppointment() {
    if (!UserService.userObject.user.agency_access_disabled && !UserService.userObject.user.user_access_disabled) {
      console.log('newAppointment being created');
      UserService.newAppointment = new AppointmentService.Appointment(CONSTANTS.APPOINTMENT_TYPE_BED);
      console.log(UserService.newAppointment);
    }
  }

}]);
