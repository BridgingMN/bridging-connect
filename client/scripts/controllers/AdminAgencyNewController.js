angular
  .module('myApp')
  .controller('AdminAgencyNewController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Agency-New!"

}]);