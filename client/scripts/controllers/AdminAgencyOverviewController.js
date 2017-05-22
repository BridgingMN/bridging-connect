angular
  .module('myApp')
  .controller('AdminAgencyOverviewController', ['UserService',
      function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.agencies = UserService.agencies;
  vm.getAgencies = UserService.getAgencies;
  vm.agency = UserService.agency;
  vm.viewAgency = UserService.viewAgency;
  vm.selected = [];
  vm.query = {
    order: 'name',
    limit: 5,
    page: 1
  };

}]);
