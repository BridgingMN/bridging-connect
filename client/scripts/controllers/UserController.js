angular
  .module('myApp')
  .controller('UserController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.user = {
    type: 'admin'
  };

  // DATA-BINDING FUNCTIONS
  vm.logout = UserService.logout;
}]);
