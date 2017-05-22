angular
  .module('myApp')
  .controller('AdminCaseworkerOverviewController', ['UserService', '$http',
      function(UserService, $http) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.selected = [];
  vm.query = {
    order: 'name',
    limit: 5,
    page: 1
  };
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
