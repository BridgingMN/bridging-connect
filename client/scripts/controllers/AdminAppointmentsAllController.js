angular
  .module('myApp')
  .controller('AdminAppointmentsAllController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Appointments-All!"

}]);