angular
  .module('myApp')
  .controller('AdminAgencyOverviewController', ['UserService', '$http',
      function(UserService, $http) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.selected = [];
  vm.query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  vm.agencies = {};
  vm.getAgencies = getAgencies;

  //GETS all agencies from db
  function getAgencies() {
    console.log('client sent request to server for all agencies');
    $http.get('/agencies').then(function(response) {
        vm.agencies.array = response.data;
        console.log(vm.agencies.array);
    });
  }

}]);
