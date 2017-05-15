angular
  .module('myApp')
  .controller('AdminAgencyOverview', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Agency-Overview!"

}]);