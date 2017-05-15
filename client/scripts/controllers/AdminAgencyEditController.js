angular
  .module('myApp')
  .controller('AdminAgencyEditController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Agency-Edit!"

}]);