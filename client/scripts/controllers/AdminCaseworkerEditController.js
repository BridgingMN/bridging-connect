angular
  .module('myApp')
  .controller('AdminCaseworkerEditController', ['UserService', '$http', '$location',
      function(UserService, $http, $location) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference
  vm.caseworker = UserService.caseworker;
  vm.viewCaseworker = UserService.viewCaseworker;
  vm.editCaseworker = editCaseworker;
  // vm.deleteCaseworker = deleteCaseworker;

  //Saves edits made to Caseworker record in the admin-caseworker-edit view
  function editCaseworker(caseworker) {
    console.log('Save changes clicked: ', caseworker);
    $http.put('/caseworkers/', caseworker).then(function() {
      console.log('saves edits ', caseworker);
      $location.path('/admin-caseworker-overview');
      alert('Your edits to ' + caseworker.first + caseworker.last + ' have been saved.');
    });
  }

}]);
