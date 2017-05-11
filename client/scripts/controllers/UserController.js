myApp.controller('UserController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
  // DATA-BINDING VARIABLES
  var user = this; // controller reference

  // DATA-BINDING FUNCTIONS
  user.logout = UserService.logout;
}]);
