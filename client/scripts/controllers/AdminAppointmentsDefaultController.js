angular
  .module('myApp')
  .controller('AdminAppointmentsDefaultController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Appointments-Default!"

}]);