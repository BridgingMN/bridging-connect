angular
  .module('myApp')
  .controller('AdminAppointmentsDefaultController', ['$http', 'UserService',
      function($http, UserService) {

  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.selected = UserService.selected;
  vm.query = UserService.query;
  vm.allDefaults = {};
  vm.getAllDefaults = getAllDefaults;
  console.log('in defaults controller;', vm.allDefaults);


  //GETS all default appointment slots from db
  function getAllDefaults() {
    console.log('client request to server for all default appointments');
    $http.get('/schedule/default').then(function(response) {
      vm.allDefaults.array = response.data;
      console.log(vm.allDefaults.array);
    });
  }

}]);
