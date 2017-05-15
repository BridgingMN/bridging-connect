angular
  .module('myApp')
  .controller('AdminAgencyOverviewController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Agency-Overview!"

}]);