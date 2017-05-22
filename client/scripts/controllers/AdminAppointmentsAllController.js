angular
  .module('myApp')
  .controller('AdminAppointmentsAllController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.selected = [];
  vm.query = {
    order: 'name',
    limit: 5,
    page: 1
  };

  vm.allAppointments = {};
  vm.getAllAppointments = getAllAppointments;

  //GETS all appointments from db
  function getAllAppointments() {
    console.log('client request to server for all appointemtns');
    $http.get('/appointments/all').then(function(response) {
      vm.allAppointments.array = response.data;
      console.log(vm.allAppointments.array);
    });
  }

}]);
