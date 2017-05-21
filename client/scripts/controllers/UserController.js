angular
  .module('myApp')
  .controller('UserController', ['CONSTANTS', 'UserService', function(CONSTANTS, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.CONSTANTS = CONSTANTS;
  vm.userObject = UserService.userObject;

  // DATA-BINDING FUNCTIONS
  vm.logout = UserService.logout;
}]);
