angular
  .module('myApp')
  .controller('AdminAppointmentsAllController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.selected = UserService.selected;
  vm.query = UserService.query;
  vm.allAppointments = {};
  vm.getAllAppointments = getAllAppointments;

  //GETS all appointments from db
  function getAllAppointments() {
    console.log('client request to server for all appointments');
    $http.get('/appointments/all').then(function(response) {
      vm.allAppointments.array = response.data;
      console.log(vm.allAppointments.array);
    });
  }

  $http.get('appointments/7').then(function(response) {
    console.log('GOT APPOINTMENT 7:', response.data);
  });

}]);
