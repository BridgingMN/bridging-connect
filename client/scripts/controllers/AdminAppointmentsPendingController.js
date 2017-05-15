angular
  .module('myApp')
  .controller('AdminAppointmentsPendingController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Appointments-Pending!"

}]);