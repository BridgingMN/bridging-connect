angular
  .module('myApp')
  .controller('AdminAppointmentsCustomizeController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.query = UserService.query;
  vm.overrides = {};
  vm.getAllOverrides = getAllOverrides;

  function getAllOverrides() {
    console.log('client request to server for all override slots');
    $http.get('/overrides/all').then(function(response) {
      vm.overrides.array =response.data;
      console.log('All Overrides: ', vm.overrides.array);
    });
  }

}]);
