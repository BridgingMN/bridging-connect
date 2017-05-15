angular
  .module('myApp')
  .controller('AdminAppointmentsCustomizeController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Appointments-Customize!"

}]);