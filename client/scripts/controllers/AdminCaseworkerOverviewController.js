angular
  .module('myApp')
  .controller('AdminCaseworkerOverviewController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  // vm.selected = UserService.selected;
  vm.query = UserService.query;
  vm.caseworker = UserService.caseworker;
  vm.viewCaseworker = UserService.viewCaseworker;
  vm.caseworkers = {};
  vm.getCaseworkers = getCaseworkers;

  //GETS all caseworkers from db
  function getCaseworkers() {
    console.log('client sent request to server for all caseworkers');
    $http.get('/caseworkers').then(function(response) {
      vm.caseworkers.array = response.data;
      console.log(vm.caseworkers.array);
    });
  }


}]);
