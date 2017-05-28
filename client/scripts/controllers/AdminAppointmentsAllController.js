angular
  .module('myApp')
  .controller('AdminAppointmentsAllController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  // vm.selected = UserService.selected;
  vm.query = UserService.query;
  vm.allAppointments = {};
  vm.getAllAppointments = getAllAppointments;
  vm.appointment = UserService.appointment;
  vm.viewDetails = UserService.viewDetails;

  //GETS all appointments from db
  function getAllAppointments() {
    console.log('client request to server for all appointments');
    $http.get('/appointments/all').then(function(response) {
      vm.allAppointments.array = response.data;
      console.log(vm.allAppointments.array);
    });
  }

}]);
