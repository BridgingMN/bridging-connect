angular
  .module('myApp')
  .controller('AdminAppointmentReviewController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.appointment = UserService.appointment;
  vm.viewDetails = UserService.viewDetails;
  // vm.editClient = editClient;
  // vm.confirmApt = confirmApt;
  // vm.denyApt = denyApt;
  // vm.cancelApt = cancelApt;


}]);
