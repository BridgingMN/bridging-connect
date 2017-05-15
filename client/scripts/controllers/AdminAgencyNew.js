angular
  .module('myApp')
  .controller('AdminAgencyNew', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Agency-New!"

}]);