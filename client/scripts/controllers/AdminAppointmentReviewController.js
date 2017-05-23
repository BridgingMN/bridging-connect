angular
  .module('myApp')
  .controller('AdminAppointmentReviewController', ['$http', 'UserService',
      function($http, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.hello = 'Controller here!';


}]);
