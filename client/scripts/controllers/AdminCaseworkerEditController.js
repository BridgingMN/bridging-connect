angular
  .module('myApp')
  .controller('AdminCaseworkerEditController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.caseworker = UserService.caseworker;
  console.log('caseworker on load of AdminCaseworkerEditController:', vm.caseworker);
  vm.viewCaseworker = UserService.viewCaseworker;
  vm.editCaseworker = editCaseworker;
  // vm.deleteCaseworker = deleteCaseworker;

  //Saves edits made to Caseworker record in the admin-caseworker-edit view
  function editCaseworker(caseworker) {
    console.log('EDITING CASEWORKER: ', caseworker);
    $http.put('/caseworkers/', caseworker).then(function() {
      $location.path('/admin-caseworker-overview');
      alert('Your edits to ' + caseworker.first + caseworker.last + ' have been saved.');
    });
  }

}]);
