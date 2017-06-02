angular
  .module('myApp')
  .controller('AdminAppointmentsPendingController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  // vm.selected = UserService.selected;
  vm.query = UserService.query;
  vm.appointment = UserService.appointment;
  vm.viewDetails = UserService.viewDetails;
  vm.pendingAppointments = {};
  vm.getPendingAppointments = getPendingAppointments;

  //GETS all appointments from db
  function getPendingAppointments() {
    console.log('client request to server for pending appointments');
    $http.get('/appointments/pending').then(function(response) {
      vm.pendingAppointments.array = response.data;
      console.log(vm.pendingAppointments.array);
    });
  }

}]);
