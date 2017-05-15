angular
  .module('myApp')
  .controller('AdminCaseworkerOverviewController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Caseworker-Overview!"

}]);