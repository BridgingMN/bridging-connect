angular
  .module('myApp')
  .controller('AdminCaseworkerNewController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.agencies = UserService.agencies;
  vm.getAgencies = UserService.getAgencies;
  vm.caseworker = {};

  vm.createCaseworker = createCaseworker;

  //Creates a new Agency
  function createCaseworker() {
    console.log('Create Caseworker clicked', vm.caseworker);
    $http.post('/caseworkers', vm.caseworker).then(function(response) {
      console.log(response);
      $location.path('/admin-caseworker-overview');
      alert('The new caseworker has been added.');
    });
  }

}]);
