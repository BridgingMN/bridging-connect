angular
  .module('myApp')
  .controller('AdminDefaultAppointmentNewController', ['UserService',
      function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = 'Hello in new Appointments-Default!';

}]);
