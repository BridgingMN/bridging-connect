angular
  .module('myApp')
  .controller('AdminCaseworkerNewController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = "Hello in Caseworker-New!"

}]);