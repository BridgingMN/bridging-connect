angular
  .module('myApp')
  .controller('AdminAgencyEditController', ['UserService', '$http',
      function(UserService, $http) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.agency = UserService.agency;
  vm.viewAgency = UserService.viewAgency;

}]);
