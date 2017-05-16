angular
  .module('myApp')
  .controller('UserController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  // DATA-BINDING FUNCTIONS
  vm.logout = UserService.logout;
}]);
